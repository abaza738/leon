export default defineNuxtRouteMiddleware((_to, _from) => {
  const {isAdmin} = useAuth()

  if (!isAdmin.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access forbidden - Admin role required'
    })
  }
})
