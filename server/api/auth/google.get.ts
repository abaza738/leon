export default defineOAuthGoogleEventHandler({
  onSuccess: async (event, result) => {
    // TODO: Hardcoded for testing; set if user is Leon or a maintainer
    const isAdmin = true
    await setUserSession(event, { user: result.user, isAdmin })
    return sendRedirect(event, '/')
  },
})
