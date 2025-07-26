export function useProducts() {
  const {$pb} = useNuxtApp()

  const {
    data: products,
    pending: loading,
    error,
    refresh
  } = useAsyncData('products', () => $pb.collection('products').getFullList({expand: 'category'}), {
    default: () => []
  })

  async function getProductWithAddons(id: string) {
    try {
      const product = await $pb.collection('products').getOne(id, {
        expand: 'category,addon_groups_via_product,addon_groups_via_product.addons_via_addon_group',
        filter: 'is_available = true'
      })
      return product
    } catch (error) {
      console.error('Failed to fetch product with addons:', error)
      return null
    }
  }

  return {
    products,

    loading,
    error,

    refresh,
    getProductWithAddons
  }
}
