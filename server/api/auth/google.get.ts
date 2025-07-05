export default defineOAuthGoogleEventHandler({
  onSuccess: async (event, result) => {
    await setUserSession(event, { user: result.user })
    return sendRedirect(event, '/')
  }
})
