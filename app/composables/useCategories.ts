export function useCategories() {
  const {$pb} = useNuxtApp()

  const {
    data: categories,
    pending: loading,
    error,
    refresh
  } = useAsyncData(
    'categories',
    () =>
      $pb
        .collection('categories')
        .getFullList({sort: 'sort_order,name', filter: 'is_active = true'}),
    {default: () => []}
  )

  return {
    categories,
    loading,
    error,

    refresh
  }
}
