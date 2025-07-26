import type {Order, CartItem} from '~/types/restaurant'
import {calculateOrderTotal} from '~/utils/calculations'
import {executeBatchOperations} from '~/utils/pocketbase'

export const useOrdersStore = defineStore('orders', () => {
  const {$pb} = useNuxtApp()
  const {user, userId, isAdmin} = useAuth()

  // User orders data fetching
  const {
    data: userOrdersData,
    pending: userOrdersLoading,
    error: userOrdersError,
    refresh: refreshUserOrders
  } = useAsyncData(
    () => `user-orders-${userId.value}`,
    async () => {
      if (!userId.value) return []

      return await $pb.collection('orders').getFullList({
        sort: '-created',
        expand: 'order_items_via_order,order_items_via_order.product',
        filter: $pb.filter('customer = {:userId}', {userId: userId.value}),
        requestKey: `user-orders-${userId.value}`
      })
    },
    {default: () => [], watch: [userId]}
  )

  // Admin orders data fetching
  const {
    data: adminOrdersData,
    pending: adminOrdersLoading,
    error: adminOrdersError,
    refresh: refreshAdminOrders
  } = useAsyncData<Order[]>(
    'admin-orders',
    async () => {
      if (!isAdmin.value) return []
      return await $pb.collection('orders').getFullList({
        sort: '-created',
        expand: 'customer,order_items_via_order,order_items_via_order.product',
        requestKey: 'admin-orders'
      })
    },
    {default: () => [], watch: [isAdmin]}
  )

  // Track active order details for real-time updates
  const activeOrderDetails = ref(new Map<string, {refresh: () => Promise<void>}>())

  // Real-time subscriptions with error handling
  $pb.collection('orders').subscribe('*', async (e) => {
    try {
      // Only refresh relevant data based on user type and order ownership
      if (isAdmin.value) {
        // Admins see all orders, so refresh admin data
        await refreshAdminOrders()
      } else if (e.record.customer === userId.value) {
        // Users only see their own orders
        await refreshUserOrders()
      }

      // Also refresh any active order details for this specific order
      const orderDetailsRefresh = activeOrderDetails.value.get(e.record.id)
      if (orderDetailsRefresh) {
        await orderDetailsRefresh.refresh()
      }
    } catch (error) {
      console.error('Error refreshing orders from subscription:', error)
    }
  })

  // Computed state
  const loading = computed(() => userOrdersLoading.value || adminOrdersLoading.value)
  const error = computed(() => userOrdersError.value || adminOrdersError.value)

  const adminStats = computed(() => {
    const orders = adminOrdersData.value
    if (!orders?.length) {
      return {pending: 0, preparing: 0, todayOrders: 0, todayRevenue: 0}
    }

    const today = new Date().toISOString().slice(0, 10)
    const todayOrders = orders.filter((order: Order) => order.created.slice(0, 10) === today)
    const statusCounts = orders.reduce(
      (acc: Record<string, number>, order: Order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      pending: statusCounts.pending || 0,
      preparing: statusCounts.preparing || 0,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((acc: number, order: Order) => acc + order.total_amount, 0)
    }
  })

  // Functions
  function getOrderDetails(orderId: string) {
    const key = isAdmin.value ? `admin-order-details-${orderId}` : `user-order-details-${orderId}`
    const requestKey = `order-details-${orderId}`

    const {data, pending, error, refresh} = useAsyncData(key, async () => {
      const order = await $pb.collection('orders').getOne(orderId, {
        expand: 'customer,order_items_via_order,order_items_via_order.product',
        requestKey
      })

      return {
        order,
        items: order.expand?.order_items_via_order || []
      }
    })

    // Register this order details for real-time updates
    activeOrderDetails.value.set(orderId, {refresh})

    // Clean up when the component using this is destroyed
    onUnmounted(() => {
      activeOrderDetails.value.delete(orderId)
    })

    return {data, pending, error, refresh}
  }

  async function createOrder(cartItems: CartItem[], notes = '') {
    try {
      if (!userId.value) throw new Error('User must be logged in')

      const totalAmount = calculateOrderTotal(cartItems)

      // Create order first to get the order ID
      const order = await $pb.collection('orders').create(
        {
          customer: userId.value,
          customer_name: user.value?.name,
          customer_floor: user.value?.floor_number,
          status: 'pending',
          subtotal: totalAmount,
          total_amount: totalAmount,
          order_type: 'now',
          payment_status: 'pending',
          payment_method: 'cash',
          notes
        },
        {requestKey: `create-order-${Date.now()}`}
      )

      // Use batch operations for order items
      const orderItemOperations = cartItems.map((item) => ({
        type: 'create' as const,
        collection: 'order_items',
        data: {
          order: order.id,
          product: item.product,
          product_name: item.expand?.product?.name,
          quantity: item.quantity,
          selected_addons: item.selected_addons || {},
          special_instructions: item.special_instructions,
          unit_price: item.item_total / item.quantity,
          total_price: item.item_total
        }
      }))

      await executeBatchOperations($pb, orderItemOperations)
      await refreshUserOrders()
      return order
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async function updateOrder(orderId: string, updates: Partial<Order>) {
    try {
      const updatedOrder = await $pb.collection('orders').update(orderId, updates, {
        requestKey: `update-order-${orderId}-${Date.now()}`
      })

      await refreshAdminOrders()
      return updatedOrder
    } catch (error) {
      console.error('Error updating order:', error)
      throw error
    }
  }

  return {
    // User state
    userOrders: userOrdersData,
    // Admin state
    adminOrders: adminOrdersData,
    adminStats,
    // Shared state
    loading,
    error,
    // Actions
    createOrder,
    updateOrder,
    getOrderDetails,
    refreshUserOrders,
    refreshAdminOrders
  }
})
