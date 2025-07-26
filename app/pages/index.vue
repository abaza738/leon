<template>
  <main class="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900">Menu</h1>
      <SortDropdown
        v-model="selectedSort"
        :sort-options="SORT_OPTIONS"
      />
    </div>

    <!-- Content -->
    <section class="pt-6 pb-24">
      <h2
        id="products-heading"
        class="sr-only"
        >Products</h2
      >

      <!-- Loading State -->
      <LoadingState
        v-if="loading"
        message="Loading menu..."
      />

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-16"
      >
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircleIcon class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-xl font-bold mb-2">Failed to load menu</h2>
        <p class="text-gray-600 mb-8">{{ error.message }}</p>
      </div>

      <!-- Main Content -->
      <div
        v-else
        class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4"
      >
        <CategoryFilters
          :categories="categoryNames"
          v-model:selected-category="selectedCategory"
        />
        <ProductGrid :products="sortedAndFilteredProducts" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {AlertCircleIcon} from 'lucide-vue-next'
import {useProducts} from '~/composables/useProducts'
import {useCategories} from '~/composables/useCategories'
import {SORT_OPTIONS} from '~/constants/sort-options'

definePageMeta({layout: 'user', middleware: 'authenticated'})
useHead({titleTemplate: (t) => `${t} | Menu`})

const route = useRoute()
const router = useRouter()

// Query parameter reactive state
const selectedCategory = computed({
  get: () => (route.query.category as string) || null,
  set: (value: string | null) => {
    router.push({query: {...route.query, category: value || undefined}})
  }
})

const selectedSort = computed({
  get: () => (route.query.sort as string) || 'name',
  set: (value: string) => {
    router.push({
      query: {...route.query, sort: value === 'name' ? undefined : value}
    })
  }
})

// Data fetching
const {products, loading: productsLoading, error} = useProducts()
const {categories, loading: categoriesLoading} = useCategories()

// Computed properties
const loading = computed(() => productsLoading.value || categoriesLoading.value)
const categoryNames = computed(() => categories.value?.map((cat) => cat.name) || [])

const filteredProducts = computed(() => {
  if (!selectedCategory.value || !products.value) return products.value

  const categoryId = categories.value?.find((cat) => cat.name === selectedCategory.value)?.id
  return products.value.filter((product) => product.category === categoryId)
})

const sortedAndFilteredProducts = computed(() => {
  if (!filteredProducts.value) return []

  const sorted = [...filteredProducts.value]

  switch (selectedSort.value) {
    case 'price_asc':
      return sorted.sort((a, b) => a.base_price - b.base_price)
    case 'price_desc':
      return sorted.sort((a, b) => b.base_price - a.base_price)
    case 'category':
      return sorted.sort((a, b) => {
        const aCat = categories.value?.find((c) => c.id === a.category)?.name || a.category
        const bCat = categories.value?.find((c) => c.id === b.category)?.name || b.category
        return aCat.localeCompare(bCat)
      })
    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
})
</script>
