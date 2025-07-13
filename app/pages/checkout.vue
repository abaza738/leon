<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <UButton
          @click="navigateTo('/')"
          variant="ghost"
          color="neutral"
          size="sm"
          class="mb-4"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="mr-2"
          />
          Back to Menu
        </UButton>
        <h1 class="text-2xl font-bold mb-2">Checkout</h1>
        <p class="text-gray-600"
          >Review your order and complete your purchase</p
        >
      </div>

      <LoadingState
        v-if="isSubmitting"
        message="Processing your order..."
      />

      <div
        v-else-if="orderSuccess"
        class="text-center py-16"
      >
        <div
          class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UIcon
            name="i-lucide-check-circle"
            class="w-10 h-10 text-green-500"
          />
        </div>
        <h2 class="text-2xl font-bold mb-2">Order Placed!</h2>
        <p class="text-gray-600 mb-8"
          >Your order will be ready in 30-45 minutes</p
        >

        <div class="flex gap-4 justify-center">
          <UButton
            @click="navigateTo('/orders')"
            color="primary"
            >View Orders</UButton
          >
          <UButton
            @click="navigateTo('/')"
            variant="outline"
            >Continue Shopping</UButton
          >
        </div>
      </div>

      <div
        v-else-if="!hasItems"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-shopping-cart"
          class="w-20 h-20 text-gray-400 mb-6"
        />
        <h2 class="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p class="text-gray-600 mb-8 text-lg"
          >Add some delicious items to get started</p
        >
        <UButton
          @click="navigateTo('/')"
          color="primary"
          size="lg"
        >
          <UIcon
            name="i-lucide-utensils"
            class="mr-2"
          />
          Browse Menu
        </UButton>
      </div>

      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div class="lg:col-span-2">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Your Order</h2>
            <UButton
              @click="handleClearCart"
              variant="ghost"
              size="sm"
              class="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <UIcon
                name="i-lucide-trash-2"
                class="mr-1"
              />
              Clear Cart
            </UButton>
          </div>

          <div class="space-y-4">
            <div
              v-for="item in cartStore.cartItems"
              :key="item.product.id"
              class="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm"
            >
              <img
                v-if="getProductImageUrl(item.product)"
                :src="getProductImageUrl(item.product)"
                :alt="item.product.name"
                class="w-16 h-16 object-cover rounded-lg"
              />
              <div
                v-else
                class="flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-image"
                  class="w-8 h-8 text-muted"
                />
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{
                  item.product.name
                }}</h4>
                <p class="text-sm text-gray-600">
                  {{ item.quantity }} × {{ item.product.price.toFixed(2) }} JD
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold text-emerald-600 text-lg">
                  {{ (item.product.price * item.quantity).toFixed(2) }} JD
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 class="text-xl font-semibold mb-6">Order Summary</h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>{{ cartStore.cartTotal.toFixed(2) }} JD</span>
              </div>
              <div class="border-t pt-4">
                <div class="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span class="text-emerald-600"
                    >{{ cartStore.cartTotal.toFixed(2) }} JD</span
                  >
                </div>
              </div>
            </div>

            <UForm
              :state="orderForm"
              @submit="handleSubmit"
              class="space-y-6"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (optional)
                </label>
                <UTextarea
                  v-model="orderForm.notes"
                  placeholder="Any special requests or dietary requirements..."
                  :rows="3"
                  class="w-full mb-4"
                />
              </div>

              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                :loading="isSubmitting"
                :disabled="!hasItems"
              >
                <UIcon
                  name="i-lucide-credit-card"
                  class="mr-2"
                />
                Place Order
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useOrders } from '~/composables/useOrders'
import { useProducts } from '~/composables/useProducts'

definePageMeta({
  layout: 'user',
  name: 'checkout',
  middleware: 'authenticated',
})

useHead({ title: 'Checkout' })

const { user } = useAuth()
const cartStore = useCartStore()
const { createOrder } = useOrders()
const { getProductImageUrl } = useProducts()
const toast = useToast()

const isSubmitting = ref(false)
const orderSuccess = ref(false)
const orderForm = ref({ notes: '' })

const hasItems = computed(() => cartStore.cartItems?.length > 0)

async function handleSubmit() {
  if (!hasItems.value) return

  isSubmitting.value = true
  try {
    await createOrder(
      [...cartStore.cartItems],
      orderForm.value.notes?.trim() || '',
    )
    await cartStore.clearCart()

    toast.add({
      title: 'Order Placed!',
      description: 'Your order has been received',
      color: 'success',
    })

    orderSuccess.value = true
  } catch (err: any) {
    toast.add({
      title: 'Order Failed',
      description: err?.message || 'Please try again',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

function handleClearCart() {
  try {
    cartStore.clearCart()
    toast.add({ title: 'Cart Cleared', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Error clearing cart', color: 'error' })
  }
}
</script>
