<template>
  <div class="p-6">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Order Management</h1>
          <p class="text-gray-600 mt-1">Manage all restaurant orders</p>
        </div>

        <div class="flex items-center gap-4">
          <!-- Sound Control -->
          <UButton
            @click="toggleMute"
            variant="outline"
            size="sm"
            :color="isMuted ? 'error' : 'success'"
            class="flex items-center gap-2"
          >
            <UIcon
              :name="isMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
              class="w-4 h-4"
            />
            <span class="text-xs">{{ isMuted ? 'Muted' : 'Sound On' }}</span>
          </UButton>

          <!-- Connection Status -->
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                isSubscribed ? 'bg-green-500 animate-pulse' : 'bg-red-500',
              ]"
            ></div>
            <span
              :class="[
                'text-sm font-medium',
                isSubscribed ? 'text-green-700' : 'text-red-700',
              ]"
            >
              {{ isSubscribed ? 'Real-time Connected' : 'Disconnected' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <LoadingState
      v-if="loading"
      message="Loading orders..."
    />

    <UAlert
      v-else-if="error"
      icon="i-lucide-alert-circle"
      color="error"
      :title="error.message"
      class="mb-6"
    />

    <div
      v-else
      class="space-y-6"
    >
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UCard class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.placed }}</div>
          <div class="text-sm text-gray-600">New Orders</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{
            stats.preparing
          }}</div>
          <div class="text-sm text-gray-600">Preparing</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-success">{{
            paymentStats.paid
          }}</div>
          <div class="text-sm text-gray-600">Paid Orders</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-primary"
            >{{ paymentStats.totalRevenue.toFixed(2) }} JD</div
          >
          <div class="text-sm text-gray-600">Revenue</div>
        </UCard>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <UButton
          @click="selectedStatus = null"
          :variant="selectedStatus === null ? 'solid' : 'outline'"
          size="sm"
        >
          All Orders
        </UButton>
        <UButton
          @click="selectedStatus = 'placed'"
          :variant="selectedStatus === 'placed' ? 'solid' : 'outline'"
          color="neutral"
          size="sm"
        >
          New
        </UButton>
        <UButton
          @click="selectedStatus = 'preparing'"
          :variant="selectedStatus === 'preparing' ? 'solid' : 'outline'"
          color="neutral"
          size="sm"
        >
          Preparing
        </UButton>
        <UButton
          @click="selectedStatus = 'finished'"
          :variant="selectedStatus === 'finished' ? 'solid' : 'outline'"
          color="neutral"
          size="sm"
        >
          Finished
        </UButton>
      </div>

      <!-- Orders Table -->
      <UCard
        v-if="filteredOrders.length === 0"
        class="text-center py-8"
      >
        <UIcon
          name="i-lucide-clipboard-list"
          class="w-12 h-12 text-gray-400 mx-auto mb-3"
        />
        <h3 class="text-lg font-medium mb-2">No orders found</h3>
        <p class="text-gray-500">No orders match the selected filter</p>
      </UCard>

      <UTable
        v-else
        :data="filteredOrders"
        :columns="columns"
      />
    </div>

    <!-- Update Status Modal -->
    <UModal
      v-model:open="showUpdateModal"
      title="Update Order Status"
    >
      <template #body>
        <div
          v-if="selectedOrder"
          class="space-y-4"
        >
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="font-mono text-lg font-bold"
              >#{{ selectedOrder.id.slice(-8) }}</p
            >
            <p class="text-emerald-600 font-semibold"
              >{{ selectedOrder.total_amount.toFixed(2) }} JD</p
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Change Status To
            </label>
            <USelect
              v-model="newStatus"
              :items="statusOptions"
              value-key="value"
            />
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton
          @click="close"
          variant="outline"
          >Cancel</UButton
        >
        <UButton
          @click="updateOrderStatus"
          :loading="updating"
          color="success"
        >
          Update Status
        </UButton>
      </template>
    </UModal>

    <!-- Order Details Modal -->
    <UModal
      v-model:open="showDetailsModal"
      title="Order Details"
    >
      <template #body>
        <div
          v-if="selectedOrder"
          class="space-y-4"
        >
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">Order ID:</span>
              <span class="ml-2 font-mono"
                >#{{ selectedOrder.id.slice(-8) }}</span
              >
            </div>
            <div>
              <span class="font-medium">Status:</span>
              <UBadge
                :color="getOrderStatusColor(selectedOrder.status)"
                class="ml-2"
              >
                {{ getOrderStatusText(selectedOrder.status) }}
              </UBadge>
            </div>
            <div>
              <span class="font-medium">Customer:</span>
              <span class="ml-2">{{
                selectedOrder.expand?.customer?.name || 'Unknown'
              }}</span>
            </div>
            <div>
              <span class="font-medium">Total:</span>
              <span class="ml-2 font-semibold"
                >{{ selectedOrder.total_amount.toFixed(2) }} JD</span
              >
            </div>
          </div>

          <div
            v-if="selectedOrder.notes"
            class="p-3 bg-gray-50 rounded"
          >
            <span class="font-medium text-sm">Notes:</span>
            <p class="mt-1 text-sm">{{ selectedOrder.notes }}</p>
          </div>

          <div>
            <h4 class="font-semibold mb-2">Order Items</h4>
            <LoadingState
              v-if="loadingItems"
              message="Loading items..."
            />
            <div
              v-else-if="orderItems.length === 0"
              class="text-center py-4 text-gray-500"
            >
              No items found
            </div>
            <div
              v-else
              class="space-y-2"
            >
              <div
                v-for="item in orderItems"
                :key="item.id"
                class="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <p class="font-medium">{{
                    item.expand?.product?.name || 'Unknown Product'
                  }}</p>
                  <p class="text-sm text-gray-600"
                    >{{ item.quantity }} ×
                    {{ item.unit_price.toFixed(2) }} JD</p
                  >
                </div>
                <p class="font-semibold">{{ item.subtotal.toFixed(2) }} JD</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton
          @click="close"
          variant="outline"
          >Close</UButton
        >
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Order, OrderItem } from '~/types/restaurant'
import type { TableColumn } from '@nuxt/ui'
import { useNotificationSound } from '~/composables/useNotificationSound'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ titleTemplate: (t) => `${t} | Admin - Orders` })

// Sound notification system
const { isMuted, play, playTest, toggleMute } = useNotificationSound()

const {
  orders,
  loading,
  error,
  stats,
  updateOrderStatus: updateStatus,
  getOrderItems,
  getOrderStatusColor,
  getOrderStatusText,
  isSubscribed,
} = useAdminOrders(play)

const toast = useToast()

const selectedStatus = ref<Order['status'] | null>(null)
const showUpdateModal = ref(false)
const showDetailsModal = ref(false)
const selectedOrder = ref<(Order & { expand?: { customer?: any } }) | null>(
  null,
)
const newStatus = ref<Order['status']>('placed')
const updating = ref(false)
const loadingItems = ref(false)
const orderItems = ref<(OrderItem & { expand?: { product?: any } })[]>([])

const statusOptions = [
  { label: 'Placed', value: 'placed' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Finished', value: 'finished' },
]

const filteredOrders = computed(() => {
  if (!orders.value) return []
  return selectedStatus.value
    ? orders.value.filter((order) => order.status === selectedStatus.value)
    : orders.value
})

const paymentStats = computed(() => {
  if (!orders.value) return { paid: 0, totalRevenue: 0 }

  return orders.value.reduce(
    (acc, order) => {
      if ((order as any).paid) {
        acc.paid++
        acc.totalRevenue += order.total_amount
      }
      return acc
    },
    { paid: 0, totalRevenue: 0 },
  )
})

const viewOrderDetails = async (
  order: Order & { expand?: { customer?: any } },
) => {
  selectedOrder.value = order
  showDetailsModal.value = true
  loadingItems.value = true

  try {
    orderItems.value = await getOrderItems(order.id)
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to load items',
      color: 'error',
    })
    orderItems.value = []
  } finally {
    loadingItems.value = false
  }
}

const showUpdateStatus = (order: Order & { expand?: { customer?: any } }) => {
  selectedOrder.value = order
  newStatus.value = order.status
  showUpdateModal.value = true
}

const updateOrderStatus = async () => {
  if (!selectedOrder.value) return

  updating.value = true
  try {
    await updateStatus(selectedOrder.value.id, newStatus.value)
    showUpdateModal.value = false
    selectedOrder.value = null
  } catch (error) {
    console.error('Update error:', error)
    // Toast will be handled by the composable via notification callback
  } finally {
    updating.value = false
  }
}

// Table configuration
const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: 'Order',
    cell: ({ row }) => `#${(row.getValue('id') as string).slice(-8)}`,
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const order = row.original as any
      return (
        order.expand?.customer?.name ||
        order.expand?.customer?.email ||
        'Unknown'
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Order['status']
      return h(
        resolveComponent('UBadge'),
        { color: getOrderStatusColor(status) },
        () => getOrderStatusText(status),
      )
    },
  },
  {
    accessorKey: 'total_amount',
    header: 'Total',
    cell: ({ row }) => {
      const amount = row.getValue('total_amount') as number
      return `${amount.toFixed(2)} JD`
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const order = row.original as any
      return h('div', { class: 'flex gap-2' }, [
        h(
          resolveComponent('UButton'),
          {
            onClick: () => viewOrderDetails(order),
            variant: 'outline',
            size: 'xs',
          },
          () => 'View',
        ),
        h(
          resolveComponent('UButton'),
          {
            onClick: () => showUpdateStatus(order),
            variant: 'outline',
            size: 'xs',
            color: 'warning',
          },
          () => 'Update',
        ),
      ])
    },
  },
]
</script>
