import type { Order, OrderItem } from '~/types/restaurant'

export const useAdminOrders = () => {
  const { $pb } = useNuxtApp()
  const toast = useToast()

  const {
    data: orders,
    pending: loading,
    error,
    refresh,
  } = useAsyncData('admin-orders', () =>
    $pb
      .collection('orders')
      .getFullList<Order>({ sort: '-created', expand: 'customer' }),
  )

  const isSubscribed = ref(false)

  // Simple real-time subscription - subscribe once when composable is used
  if (!isSubscribed.value) {
    $pb.collection('orders').subscribe('*', async (e: any) => {
      await refresh() // Simple approach - just refresh the data

      // Show notifications
      switch (e.action) {
        case 'create':
          toast.add({
            title: 'New Order',
            description: 'Order received',
            color: 'info',
          })
          break
        case 'update':
          toast.add({
            title: 'Order Updated',
            description: 'Status changed',
            color: 'info',
          })
          break
        case 'delete':
          toast.add({
            title: 'Order Deleted',
            description: 'Order removed',
            color: 'warning',
          })
          break
      }
    })
    isSubscribed.value = true
  }

  function getOrderItems(orderId: string) {
    return $pb
      .collection('order_items')
      .getFullList<OrderItem>({
        filter: `order = "${orderId}"`,
        expand: 'product',
      })
  }

  async function updateOrderStatus(
    orderId: string,
    newStatus: Order['status'],
  ) {
    await $pb.collection('orders').update(orderId, { status: newStatus })
    await refresh()
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

  const stats = computed(() => {
    if (!orders.value)
      return { placed: 0, accepted: 0, rejected: 0, preparing: 0, finished: 0 }

    const counts = {
      placed: 0,
      accepted: 0,
      rejected: 0,
      preparing: 0,
      finished: 0,
    }
    orders.value.forEach((order) => counts[order.status]++)
    return counts
  })

  return {
    orders,
    loading,
    error,
    stats,
    refresh,
    updateOrderStatus,
    getOrderStatusColor,
    getOrderStatusText,
    getOrderItems,
    isSubscribed,
  }
}
