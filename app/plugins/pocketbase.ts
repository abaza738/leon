import PocketBase, {type AuthRecord} from 'pocketbase'
import type {TypedPocketBase} from '~/types/pocketbase'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const pocketbaseUrl = config.public.pocketbaseUrl

  const pb = new PocketBase(pocketbaseUrl) as TypedPocketBase

  const cookie = useCookie<{token: string; record: AuthRecord}>('pb_auth', {
    path: '/',
    secure: true,
    sameSite: 'strict',
    httpOnly: false,
    maxAge: 604800
  })

  // load the store data from the cookie value
  pb.authStore.save(cookie.value?.token, cookie.value?.record)

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookie.value = {token: pb.authStore.token, record: pb.authStore.record}
  })

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
    }
  } catch (error: any) {
    // Only clear auth store on actual auth errors, not network errors
    if (error?.status === 401 || error?.status === 403) {
      console.log('Auth token invalid, clearing auth store')
      pb.authStore.clear()
    } else {
      console.log('Network error during auth refresh, keeping auth state:', error)
    }
  }

  return {provide: {pb}}
})
