import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types/restaurant'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])

  const cartCount = computed(() => cartItems.value.length)
  const cartTotal = computed(() =>
    cartItems.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  )

  function addToCart(product: Product, quantity = 1) {
    const existing = cartItems.value.find(
      (item) => item.product.id === product.id,
    )

    if (existing) {
      existing.quantity += quantity
    } else {
      cartItems.value.push({ product, quantity })
    }
  }

  function removeFromCart(productId: string) {
    const index = cartItems.value.findIndex(
      (item) => item.product.id === productId,
    )
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const item = cartItems.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    cartItems.value = []
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
