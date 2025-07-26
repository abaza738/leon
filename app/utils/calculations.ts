import type {
  Product,
  CartItem,
  Order,
  OrderItemWithProduct,
  SelectedAddon,
  Addon
} from '~/types/restaurant'

/**
 * Calculate total price for a cart item including addons
 */
export function calculateItemTotal(
  product: Product,
  quantity: number,
  selectedAddons: SelectedAddon[] = []
): number {
  const basePrice = product.base_price * quantity
  const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * quantity
  return basePrice + addonPrice
}

/**
 * Calculate total for a single product with addons (for product page)
 */
export function calculateProductTotal(
  basePrice: number,
  quantity: number,
  addons: Array<{price_modifier: number}> = []
): number {
  const base = basePrice * quantity
  const addonTotal = addons.reduce((sum, addon) => sum + addon.price_modifier, 0) * quantity
  return base + addonTotal
}

/**
 * Calculate cart total from cart items
 */
export function calculateCartTotal(cartItems: CartItem[] | undefined): number {
  return cartItems?.reduce((total, item) => total + item.item_total, 0) || 0
}

/**
 * Calculate order total from cart items (for order creation)
 */
export function calculateOrderTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => sum + item.item_total, 0)
}

/**
 * Calculate order statistics from order items
 */
export function calculateOrderStats(items: OrderItemWithProduct[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0)
  const uniqueProducts = new Set(items.map((item) => item.product)).size

  return {
    totalItems,
    totalAmount,
    uniqueProducts,
    averageItemPrice: totalItems > 0 ? totalAmount / totalItems : 0
  }
}

/**
 * Calculate user spending statistics from orders
 */
export function calculateUserStats(orders: Order[]) {
  const totalSpent = orders.reduce((sum, order) => {
    return order.payment_status === 'paid' ? sum + order.total_amount : sum
  }, 0)

  const pendingPayment = orders.reduce((sum, order) => {
    return order.payment_status === 'pending' ? sum + order.total_amount : sum
  }, 0)

  const totalOrders = orders.length
  const paidOrders = orders.filter((order) => order.payment_status === 'paid').length
  const averageOrderValue = paidOrders > 0 ? totalSpent / paidOrders : 0

  return {
    totalSpent,
    pendingPayment,
    totalOrders,
    paidOrders,
    averageOrderValue
  }
}

/**
 * Calculate customizations total for checkout breakdown
 */
export function calculateCustomizationsTotal(cartItems: CartItem[]) {
  const customizationsMap = new Map<string, number>()
  let baseTotal = 0

  cartItems.forEach((item) => {
    // Calculate base price
    const basePrice = (item.expand?.product?.base_price || 0) * item.quantity
    baseTotal += basePrice

    // Process customizations
    if (item.selected_addons && Object.keys(item.selected_addons).length > 0) {
      Object.values(item.selected_addons).forEach((addons) => {
        if (Array.isArray(addons) && addons.length > 0) {
          addons.forEach((addon) => {
            if (addon && typeof addon === 'object' && 'name' in addon) {
              const addonPrice = addon.price * item.quantity

              if (customizationsMap.has(addon.name)) {
                customizationsMap.set(addon.name, customizationsMap.get(addon.name)! + addonPrice)
              } else {
                customizationsMap.set(addon.name, addonPrice)
              }
            }
          })
        }
      })
    }
  })

  // Convert map to array and sort
  const customizations = Array.from(customizationsMap.entries())
    .map(([name, price]) => ({name, price}))
    .sort((a, b) => a.name.localeCompare(b.name))

  const addonsTotal = customizations.reduce((sum, addon) => sum + addon.price, 0)
  const grandTotal = baseTotal + addonsTotal

  return {baseTotal, customizations, addonsTotal, grandTotal}
}

/**
 * Calculate admin dashboard statistics
 */
export function calculateDashboardStats(orders: Order[]) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const paidRevenue = orders
    .filter((order) => order.payment_status === 'paid')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const pendingRevenue = orders
    .filter((order) => order.payment_status === 'pending')
    .reduce((sum, order) => sum + order.total_amount, 0)

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Order status breakdown
  const statusBreakdown = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Payment status breakdown
  const paymentBreakdown = orders.reduce(
    (acc, order) => {
      acc[order.payment_status] = (acc[order.payment_status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    totalOrders,
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    averageOrderValue,
    statusBreakdown,
    paymentBreakdown
  }
}

/**
 * Convert Addon array to SelectedAddon array
 */
export function convertToSelectedAddons(addons: Addon[]): SelectedAddon[] {
  return addons.map((addon) => ({
    addon_id: addon.id,
    name: addon.name,
    price: addon.price_modifier,
    addon_group: addon.addon_group
  }))
}

/**
 * Validate cart item data
 */
export function validateCartItem(product: Product, quantity: number): boolean {
  return product.is_available && quantity > 0
}

/**
 * Calculate addon price for display
 */
export function calculateAddonPrice(addon: {price: number}, quantity: number = 1): number {
  return addon.price * quantity
}

/**
 * Get addon display text with price (handles both price and price_modifier fields)
 */
export function getAddonDisplayText(addon: {
  name: string
  price?: number
  price_modifier?: number
}): string {
  const addonPrice = addon.price ?? addon.price_modifier ?? 0
  const priceText = addonPrice > 0 ? ` (+${addonPrice})` : ' (FREE)'
  return `${addon.name}${priceText}`
}
