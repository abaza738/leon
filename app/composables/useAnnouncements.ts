export function useAnnouncements() {
  const {$pb} = useNuxtApp()

  const {
    data: announcements,
    refresh,
    pending: loading,
    error
  } = useAsyncData(
    'announcements',
    async () => {
      const now = new Date().toISOString()

      const records = await $pb.collection('announcements').getFullList({
        sort: '-created',
        filter: `is_active = true && start_date <= "${now}" && end_date >= "${now}"`
      })
      return records
    },
    {default: () => []}
  )

  return {
    announcements: readonly(announcements),
    loading: readonly(loading),
    error: readonly(error),

    refresh
  }
}
