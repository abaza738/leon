import type {Product} from '~/types/restaurant'

type AddonCollection = Record<string, Array<{id: string; name: string; price: number}>>

export const useCartStore = defineStore('cart', () => {
  const {$pb} = useNuxtApp()
  const {userId} = useAuth()

  if (!userId.value) {
    throw new Error('User must be logged in to access cart')
  }

  const {
    data: cartItems,
    refresh: refreshCart,
    pending
  } = useAsyncData('user-cart', async () => {
    return await $pb.collection('cart').getFullList({
      filter: `customer = "${userId.value}"`,
      expand: 'product',
      sort: '-created'
    })
  })

  const cartCount = computed(() => cartItems.value?.length ?? 0)
  const cartTotal = computed(() => calculateCartTotal(cartItems.value))
  const isEmpty = computed(() => !cartItems.value?.length)

  async function addToCart(product: Product, quantity = 1, selectedAddons: AddonCollection = {}) {
    try {
      const flatAddons = convertAddonsToFlat(selectedAddons)
      const addonHash = generateAddonHash(selectedAddons)

      const existingItems = await $pb.collection('cart').getFullList({
        filter: `customer = "${userId.value}" && product = "${product.id}"`,
        expand: 'product'
      })

      const existingItem = findExistingCartItem(existingItems, addonHash)

      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + quantity
        const itemTotal = calculateItemTotal(product, newQuantity, flatAddons)

        await $pb.collection('cart').update(existingItem.id, {
          quantity: newQuantity,
          item_total: itemTotal,
          selected_addons: selectedAddons
        })
      } else {
        // Create new cart item
        const itemTotal = calculateItemTotal(product, quantity, flatAddons)

        await $pb.collection('cart').create({
          customer: userId.value,
          product: product.id,
          quantity,
          item_total: itemTotal,
          selected_addons: selectedAddons
        })
      }

      await refreshCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }

      const item = cartItems.value?.find((i) => i.id === itemId)
      if (!item?.expand?.product) {
        throw new Error('Cart item or product not found')
      }

      const product = item.expand.product
      const selectedAddons = item.selected_addons || {}
      const flatAddons = convertAddonsToFlat(selectedAddons)
      const itemTotal = calculateItemTotal(product, quantity, flatAddons)

      await $pb.collection('cart').update(itemId, {
        quantity,
        item_total: itemTotal,
        selected_addons: selectedAddons
      })

      await refreshCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
      throw error
    }
  }

  async function removeItem(itemId: string): Promise<void> {
    try {
      await $pb.collection('cart').delete(itemId)
      await refreshCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
      throw error
    }
  }

  async function clearCart() {
    try {
      const cartItemsToDelete = await $pb
        .collection('cart')
        .getFullList({filter: `customer = "${userId.value}"`, fields: 'id'})

      if (cartItemsToDelete.length === 0) return

      const deleteOperations = cartItemsToDelete.map((item) => ({
        type: 'delete' as const,
        collection: 'cart',
        id: item.id
      }))

      await executeBatchOperations($pb, deleteOperations)
      await refreshCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    isEmpty,
    pending,

    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart
  }
})

function convertAddonsToFlat(selectedAddons: AddonCollection) {
  return Object.values(selectedAddons)
    .flat()
    .map((addon) => ({
      addon_id: addon.id,
      name: addon.name,
      price: Number(addon.price) || 0
    }))
}

function generateAddonHash(selectedAddons: AddonCollection) {
  return JSON.stringify(selectedAddons || {})
}

function findExistingCartItem(items: any[], addonHash: string) {
  return items.find((item) => {
    const itemAddonHash = JSON.stringify(item.selected_addons || {})
    return itemAddonHash === addonHash
  })
}
