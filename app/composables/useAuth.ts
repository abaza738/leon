export const useAuth = () => {
  const {$pb} = useNuxtApp()
  const {authStore} = $pb

  const isAuthenticated = ref(authStore.isValid)
  const user = ref(authStore.record)
  const userId = computed(() => user.value?.id)
  const isAdmin = computed(() => authStore.record?.is_admin)

  const avatarUrl = computed(() => {
    if (!user.value?.avatar || !user.value?.id) return null
    return getFileUrl(user.value, user.value.avatar)
  })

  async function loginWithGoogle() {
    try {
      const authData = await $pb.collection('users').authWithOAuth2({provider: 'google'})

      return authData
    } catch (error: any) {
      console.error('Google OAuth failed:', error)

      // Check if it's a domain restriction error
      if (error.status === 400) {
        const errorMessage = error.message || error.data?.message || ''

        if (
          errorMessage.includes('Failed to create record') ||
          errorMessage.includes('domain') ||
          errorMessage.includes('email')
        ) {
          // This is likely a domain restriction error
          throw new Error(
            'Access denied: Your email domain is not authorized. Please use a company email address.'
          )
        }
      }

      // For other errors, provide a generic but helpful message
      const userFriendlyMessage = error.message || 'Authentication failed. Please try again.'
      throw new Error(userFriendlyMessage)
    }
  }

  function logout() {
    authStore.clear()
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    isAdmin: readonly(isAdmin),
    user: readonly(user),
    userId: readonly(userId),
    avatarUrl: readonly(avatarUrl),

    loginWithGoogle,
    logout
  }
}
