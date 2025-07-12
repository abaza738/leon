import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuth()

  // Redirect authenticated users away from public auth pages
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
