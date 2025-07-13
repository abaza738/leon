import type { Order, OrderItem, CartItem } from '~/types/restaurant'

export function useOrders() {
  const { $pb } = useNuxtApp()
  const { user } = useAuth()

  const userId = user.value?.id

  if (!userId) {
    throw new Error('User must be authenticated to use orders')
  }

  const {
    data: orders,
    pending: loading,
    error,
    refresh,
  } = useAsyncData('user-orders', async () => {
    return $pb
      .collection('orders')
      .getFullList<Order>({
        sort: '-created',
        filter: `customer = "${userId}"`,
        expand: 'customer',
      })
  })

  async function createOrder(cartItems: CartItem[], notes = '') {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )

    const order = await $pb
      .collection('orders')
      .create<Order>({
        customer: userId,
        status: 'placed',
        paid: false,
        total_amount: totalAmount,
        notes,
      })

    await Promise.all(
      cartItems.map((item, index) =>
        $pb
          .collection('order_items')
          .create<OrderItem>(
            {
              order: order.id,
              product: item.product.id,
              quantity: item.quantity,
              unit_price: item.product.price,
              subtotal: item.product.price * item.quantity,
            },
            { requestKey: `item-${order.id}-${index}` },
          ),
      ),
    )

    await refresh()
    return order
  }

  function getOrderById(orderId: string) {
    return $pb
      .collection('orders')
      .getOne<Order>(orderId, { expand: 'customer' })
  }

  function getOrderItems(orderId: string) {
    return $pb
      .collection('order_items')
      .getFullList<OrderItem>({
        filter: `order = "${orderId}"`,
        expand: 'product',
      })
  }

  function getOrderStatusColor(status: Order['status']) {
    const colors = {
      placed: 'info',
      accepted: 'warning',
      rejected: 'error',
      preparing: 'warning',
      finished: 'success',
    } as const

    return colors[status] || 'neutral'
  }

  function getOrderStatusText(status: Order['status']) {
    const texts = {
      placed: 'Order Placed',
      accepted: 'Accepted',
      rejected: 'Rejected',
      preparing: 'Preparing',
      finished: 'Finished',
    }
    return texts[status] || status
  }

  return {
    orders,
    loading,
    error,
    refresh,
    createOrder,
    getOrderById,
    getOrderItems,
    getOrderStatusColor,
    getOrderStatusText,
  }
}
