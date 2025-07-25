export const useAuth = () => {
  const { $pb } = useNuxtApp()
  const { authStore } = $pb

  const isAuthenticated = ref(authStore.isValid)
  const user = ref(authStore.record)
  const token = ref(authStore.token)

  const avatarUrl = computed(() => {
    if (!user.value?.avatar || !user.value?.id) return null
    return $pb.files.getURL(user.value, user.value.avatar)
  })

  async function loginWithGoogle() {
    try {
      const authData = await $pb
        .collection('users')
        .authWithOAuth2({ provider: 'google' })

      console.log('Google OAuth successful:', {
        isValid: authStore.isValid,
        token: authStore.token,
        userId: authStore.record?.id,
        userEmail: authStore.record?.email,
      })

      return authData
    } catch (error) {
      console.error('Google OAuth failed:', error)
      throw error
    }
  }

  function logout() {
    authStore.clear()
    console.log('User logged out')
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    token: readonly(token),
    avatarUrl: readonly(avatarUrl),

    loginWithGoogle,
    logout,
  }
}
