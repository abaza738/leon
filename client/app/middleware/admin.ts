import { useAuth } from '~~/composables/useAuth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuth()

  // Redirect to auth if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }

  // TODO: Add admin role checking when implemented in PocketBase
  // For now, any authenticated user can access admin routes
  // Example future implementation:
  // const { user } = useAuth()
  // if (!user.value?.role || user.value.role !== 'admin') {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Access forbidden - Admin role required'
  //   })
  // }
})
