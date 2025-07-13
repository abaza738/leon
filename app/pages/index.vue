<template>
  <div class="min-h-screen bg-default">
    <!-- Hero Section -->
    <div class="">
      <div class="container px-4 py-8">
        <h1 class="text-3xl font-bold text-highlighted mb-2"
          >Welcome to Leon's Restaurant</h1
        >
        <p class="text-muted mb-4">Fresh ingredients, bold flavors</p>
        <div
          v-if="user"
          class="text-sm text-toned"
        >
          Hello, {{ user.name }}! 👋
        </div>
      </div>
    </div>

    <LoadingState
      v-if="loading"
      message="Loading menu..."
    />

    <!-- Error State -->
    <div
      v-else-if="error"
      class="container mx-auto px-4 py-6"
    >
      <UAlert
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :title="error.message"
      />
    </div>

    <!-- Menu Content -->
    <div
      v-else
      class="container mx-auto px-4 py-6"
    >
      <!-- Category Filter -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 flex-1">
          <UButton
            @click="selectedCategory = null"
            :variant="selectedCategory === null ? 'solid' : 'outline'"
            :color="selectedCategory === null ? 'success' : 'neutral'"
            size="sm"
          >
            All
          </UButton>
          <UButton
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            :color="selectedCategory === category ? 'success' : 'neutral'"
            size="sm"
          >
            {{ category }}
          </UButton>
        </div>

        <UButton
          v-if="cartItems?.length > 0"
          @click="handleClearCart"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="clearingCart"
        >
          <UIcon
            name="i-lucide-trash-2"
            class="mr-2"
          />
          Empty Cart
        </UButton>
      </div>

      <!-- Compact Products Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <UCard
          v-for="product in filteredProducts"
          :key="product.id"
          class="group hover:shadow-md transition-all duration-200"
          :ui="{ body: 'p-4' }"
        >
          <!-- Product Image -->
          <div
            class="aspect-square bg-muted relative overflow-hidden rounded-lg mb-3"
          >
            <img
              v-if="product.image"
              :src="getProductImageUrl(product)"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-image"
                class="w-8 h-8 text-muted"
              />
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-2">
            <h3 class="font-semibold text-highlighted text-sm">{{
              product.name
            }}</h3>
            <p class="text-xs text-muted line-clamp-2">{{
              product.description
            }}</p>

            <div class="flex items-center justify-between pt-1">
              <span class="font-bold text-lg text-success"
                >{{ product.price.toFixed(2) }} JD</span
              >

              <div class="flex items-center gap-2">
                <!-- Cart quantity controls (for items already in cart) -->
                <div
                  v-if="getCartQuantity(product.id) > 0"
                  class="flex items-center gap-1"
                >
                  <span class="text-xs text-muted mr-2">
                    In cart: {{ getCartQuantity(product.id) }}
                  </span>
                  <UButton
                    @click="decrementCartQuantity(product.id)"
                    variant="solid"
                    color="neutral"
                    size="xs"
                    square
                    icon="i-lucide-minus"
                    :loading="isProductLoading(product.id)"
                  />
                  <UButton
                    @click="incrementCartQuantity(product.id)"
                    variant="solid"
                    color="success"
                    size="xs"
                    square
                    icon="i-lucide-plus"
                    :loading="isProductLoading(product.id)"
                  />
                </div>

                <!-- New item quantity controls (for items not in cart) -->
                <div
                  v-else
                  class="flex items-center gap-1"
                >
                  <UButton
                    @click="decrementLocalQuantity(product.id)"
                    variant="solid"
                    color="neutral"
                    size="xs"
                    square
                    icon="i-lucide-minus"
                  />
                  <span
                    class="min-w-[1.5rem] text-center text-sm font-bold text-highlighted"
                  >
                    {{ getLocalQuantity(product.id) }}
                  </span>
                  <UButton
                    @click="incrementLocalQuantity(product.id)"
                    variant="solid"
                    color="success"
                    size="xs"
                    square
                    icon="i-lucide-plus"
                  />
                  <UButton
                    @click="handleAddToCart(product)"
                    :disabled="product.status !== 'available'"
                    variant="solid"
                    color="success"
                    size="xs"
                    :loading="isProductLoading(product.id)"
                  >
                    Add {{ getLocalQuantity(product.id) }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredProducts?.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-search"
          class="w-12 h-12 text-muted mx-auto mb-3"
        />
        <h3 class="font-medium text-highlighted mb-1">No items found</h3>
        <p class="text-sm text-muted">Try a different category</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useProducts } from '~/composables/useProducts'
import type { Product } from '~/types/restaurant'

definePageMeta({ layout: 'user', name: 'home', middleware: 'authenticated' })
useHead({ titleTemplate: (t) => `${t} | Menu` })

const { user } = useAuth()
const { products, categories, loading, error, getProductImageUrl } =
  useProducts()
const cartStore = useCartStore()
const { addToCart, updateQuantity } = cartStore

// Create a reactive reference to cart items
const cartItems = computed(() => cartStore.cartItems)
const toast = useToast()

const selectedCategory = ref<string | null>(null)
const loadingProducts = ref<Set<string>>(new Set())
const clearingCart = ref(false)
const localQuantities = ref<Map<string, number>>(new Map())

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value?.filter((p) => p.category === selectedCategory.value)
})

function getCartQuantity(productId: string): number {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  const item = cartItems.value.find(
    (item: any) => item.product.id === productId,
  )
  return item?.quantity || 0
}

function getLocalQuantity(productId: string): number {
  return localQuantities.value.get(productId) || 1
}

function incrementLocalQuantity(productId: string) {
  const current = getLocalQuantity(productId)
  localQuantities.value.set(productId, current + 1)
}

function decrementLocalQuantity(productId: string) {
  const current = getLocalQuantity(productId)
  if (current > 1) {
    localQuantities.value.set(productId, current - 1)
  }
}

function isProductLoading(productId: string): boolean {
  return loadingProducts.value.has(productId)
}

async function handleAddToCart(product: Product) {
  const quantity = getLocalQuantity(product.id)
  loadingProducts.value.add(product.id)

  try {
    addToCart(product, quantity) // Remove await - it's synchronous now
    // Clear local quantity after successful add
    localQuantities.value.delete(product.id)

    toast.add({
      title: 'Added to Cart',
      description: `${product.name} ${quantity > 1 ? `(${quantity})` : ''} has been added to your cart`,
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to add to cart. Please try again.',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  } finally {
    loadingProducts.value.delete(product.id)
  }
}

function incrementCartQuantity(productId: string) {
  const currentQuantity = getCartQuantity(productId)
  if (currentQuantity > 0) {
    loadingProducts.value.add(productId)
    try {
      updateQuantity(productId, currentQuantity + 1) // Remove await - it's synchronous
      // No need for refresh() - Pinia is reactive
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to update cart. Please try again.',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
    } finally {
      loadingProducts.value.delete(productId)
    }
  }
}

function decrementCartQuantity(productId: string) {
  const currentQuantity = getCartQuantity(productId)
  if (currentQuantity > 1) {
    loadingProducts.value.add(productId)
    try {
      updateQuantity(productId, currentQuantity - 1) // Remove await - it's synchronous
      // No need for refresh() - Pinia is reactive
    } catch (error) {
      toast.add({
        title: 'Error',
        description: 'Failed to update cart. Please try again.',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
    } finally {
      loadingProducts.value.delete(productId)
    }
  }
}

function handleClearCart() {
  clearingCart.value = true
  try {
    cartStore.clearCart() // Remove await - it's synchronous
    toast.add({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  } catch (err: any) {
    console.error('Error clearing cart:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to clear cart. Please try again.',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  } finally {
    clearingCart.value = false
  }
}
</script>
