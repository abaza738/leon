export default defineNuxtRouteMiddleware((_to, _from) => {
  const {isAuthenticated} = useAuth()

  // Redirect to signin if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }
})
