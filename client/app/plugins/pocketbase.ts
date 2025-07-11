import PocketBase, { type AuthRecord } from 'pocketbase'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const pocketbaseUrl = config.public.pocketbaseUrl

  const pb = new PocketBase(pocketbaseUrl)

  const cookie = useCookie<{ token: string; record: AuthRecord }>('pb_auth', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: false, // Must be false for client-side access
    maxAge: 604800, // 7 days
    // default: () => ({ token: '', record: null }),
  })

  // Load the store data from the cookie value
  if (cookie.value?.token && cookie.value?.record) {
    pb.authStore.save(cookie.value.token, cookie.value.record)
  }

  // Send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookie.value = { token: pb.authStore.token, record: pb.authStore.record }
  })

  // Only try to refresh on client-side or if we have a valid token
  if (pb.authStore.isValid) {
    try {
      // Get an up-to-date auth store state by verifying and refreshing the loaded auth model
      await pb.collection('users').authRefresh()
    } catch (error) {
      // Clear the auth store on failed refresh
      console.warn('Auth refresh failed:', error)
      pb.authStore.clear()
    }
  }

  return { provide: { pb } }
})
