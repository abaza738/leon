import type { Product } from '~/types/restaurant'

export function useProducts() {
  const { $pb } = useNuxtApp()

  const {
    data: products,
    pending: loading,
    error,
    refresh,
  } = useAsyncData<Product[]>('products', () =>
    $pb
      .collection('products')
      .getFullList<Product>({
        sort: 'category,name',
        filter: 'status = "available"',
      }),
  )

  const categories = computed(() =>
    [...new Set(products.value?.map((p) => p.category) || [])].sort(),
  )

  function getProductsByCategory(category: string) {
    return products.value?.filter((p) => p.category === category) || []
  }

  function getProductById(id: string) {
    return products.value?.find((p) => p.id === id)
  }

  const getProductImageUrl = (product: Product) => {
    try {
      return $pb.files.getURL(product, product.image)
    } catch {}
  }

  return {
    products,
    categories,
    loading,
    error,
    refresh,
    getProductsByCategory,
    getProductById,
    getProductImageUrl,
  }
}
