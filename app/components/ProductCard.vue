<template>
  <div class="flex flex-col h-full">
    <!-- Image Section (fixed height) -->
    <div class="relative flex-shrink-0">
      <NuxtLink
        :to="`/products/${product.id}`"
        class="block"
      >
        <div class="relative h-72 w-full overflow-hidden rounded-lg">
          <img
            v-if="product.image"
            :src="getProductImageUrl(product)"
            :alt="product.name"
            class="size-full object-cover"
          />
          <div
            v-else
            class="size-full bg-gray-200 flex items-center justify-center"
          >
            <ImageIcon class="w-12 h-12 text-gray-400" />
          </div>
        </div>

        <div
          class="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4"
        >
          <div
            aria-hidden="true"
            class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          ></div>
          <p class="relative text-lg font-semibold text-white">{{
            formatPrice(product.base_price)
          }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Content Section (flexible) -->
    <div class="flex flex-col flex-grow justify-between mt-4">
      <div>
        <NuxtLink :to="`/products/${product.id}`">
          <h3 class="text-sm font-medium text-gray-900">{{ product.name }}</h3>
        </NuxtLink>
      </div>

      <!-- Button Section (at bottom) -->
      <div class="mt-6">
        <Button
          @click="handleAddToCart"
          :disabled="!product.is_available || isLoading"
          variant="primary"
          size="md"
          class="w-full"
        >
          <span v-if="isLoading">Adding... </span>
          <span v-else-if="cartQuantity > 0">Added to cart ({{ cartQuantity }})</span>
          <span v-else>Add to cart</span>
          <span class="sr-only">, {{ product.name }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Product} from '~/types/restaurant'
import {ImageIcon} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import {formatPrice} from '~/utils/format'

type Props = {product: Product}

const props = defineProps<Props>()

const cartStore = useCartStore()
const {addToCart} = cartStore
const cartItems = computed(() => cartStore.cartItems)

const isLoading = ref(false)
const localQuantity = ref(1)

const cartQuantity = computed(() => {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  const item = cartItems.value.find((item: any) => item.product === props.product.id)
  return item?.quantity || 0
})

function getProductImageUrl(product: Product): string | undefined {
  return getFileUrl(product, product.image)
}

async function handleAddToCart() {
  isLoading.value = true

  try {
    await addToCart(props.product, localQuantity.value)
    localQuantity.value = 1
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
