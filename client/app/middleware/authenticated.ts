import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuth()

  // Redirect to auth if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }
})
