<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Your Cart</h3>
        <UButton
          @click="$emit('close')"
          color="neutral"
          variant="ghost"
          size="sm"
          square
        >
          <UIcon name="i-lucide-x" />
        </UButton>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Empty Cart -->
      <div
        v-if="cartItems.length === 0"
        class="text-center py-8"
      >
        <UIcon
          name="i-lucide-shopping-cart"
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-2"
          >Your cart is empty</h3
        >
        <p class="text-gray-500">Add some delicious items to get started!</p>
      </div>

      <!-- Cart Items -->
      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="item in cartItems"
          :key="item.product.id"
          class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
        >
          <!-- Product Image -->
          <div
            class="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0"
          >
            <img
              v-if="getProductImageUrl(item.product)"
              :src="getProductImageUrl(item.product)"
              :alt="item.product.name"
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
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-900 truncate">{{
              item.product.name
            }}</h4>
            <p class="text-sm text-gray-500"
              >{{ item.product.price.toFixed(2) }} JD each</p
            >
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-2">
            <UButton
              @click="updateQuantity(item.product.id, item.quantity - 1)"
              size="xs"
              color="neutral"
              variant="outline"
              square
            >
              <UIcon name="i-lucide-minus" />
            </UButton>
            <span class="text-sm font-medium w-8 text-center">{{
              item.quantity
            }}</span>
            <UButton
              @click="updateQuantity(item.product.id, item.quantity + 1)"
              size="xs"
              color="success"
              variant="outline"
              square
            >
              <UIcon name="i-lucide-plus" />
            </UButton>
          </div>

          <!-- Remove Button -->
          <UButton
            @click="removeFromCart(item.product.id)"
            color="error"
            variant="ghost"
            size="xs"
            square
          >
            <UIcon name="i-lucide-trash-2" />
          </UButton>

          <!-- Item Total -->
          <div class="text-right">
            <p class="font-medium text-gray-900">
              {{ (item.product.price * item.quantity).toFixed(2) }} JD
            </p>
          </div>
        </div>
      </div>
    </div>

    <template
      #footer
      v-if="cartItems.length > 0"
    >
      <div class="space-y-4">
        <!-- Order Summary -->
        <div class="border-t pt-4">
          <div class="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span class="text-emerald-600">{{ cartTotal.toFixed(2) }} JD</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ cartCount }} items</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <UButton
            @click="clearCart"
            color="neutral"
            variant="outline"
            class="flex-1"
          >
            Clear Cart
          </UButton>
          <UButton
            @click="$emit('checkout')"
            color="success"
            class="flex-1"
          >
            <UIcon
              name="i-lucide-credit-card"
              class="mr-2"
            />
            Checkout
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

interface Emits {
  (e: 'close'): void
  (e: 'checkout'): void
}

defineEmits<Emits>()

const cartStore = useCartStore()
const {
  cartItems,
  cartCount,
  cartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartStore
const { getProductImageUrl } = useProducts()
</script>
