<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Order Management</h1>
      <p class="text-gray-600 mt-1">Manage all restaurant orders</p>
    </div>

    <LoadingState
      v-if="!orders && loading"
      message="Loading orders..."
    />

    <div
      v-else-if="error"
      class="rounded-md bg-red-50 p-4 mb-6"
    >
      <div class="flex">
        <AlertCircleIcon class="w-5 h-5 text-red-400 shrink-0" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-2 text-sm text-red-700">{{ error.message }}</p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <DataStatistics
        :stats="orderStats"
        :columns="6"
      />

      <!-- Status Filters -->
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Order Status</h3>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="filter in statusFilters"
              :key="filter.value || 'all'"
              @click="selectedStatus = filter.value"
              :variant="selectedStatus === filter.value ? 'primary' : 'secondary'"
              size="md"
            >
              {{ filter.label }}
            </Button>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Payment Status</h3>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="filter in paymentFilters"
              :key="filter.value || 'all'"
              @click="selectedPaymentStatus = filter.value"
              :variant="selectedPaymentStatus === filter.value ? 'primary' : 'secondary'"
              size="md"
            >
              {{ filter.label }}
            </Button>
          </div>
        </div>
      </div>

      <Table
        :filtered-orders="paginatedOrders"
        :pagination="pagination"
        @open-order-modal="openOrderModal"
        @previous-page="goToPreviousPage"
        @next-page="goToNextPage"
      />
    </div>

    <!-- Order Management Modal -->
    <OrderModal
      v-model:open="showOrderModal"
      :order="selectedOrder"
    />
  </div>
</template>

<script setup lang="ts">
import type {Order, OrderWithCustomer} from '~/types/restaurant'
import {AlertCircleIcon} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import DataStatistics from '~/components/admin/DataStatistics.vue'
import Table from '~/components/ui/Table.vue'
import OrderModal from '~/components/admin/OrderModal.vue'

definePageMeta({layout: 'admin', middleware: ['authenticated', 'admin']})
useHead({titleTemplate: (t) => `${t} | Admin - Orders`})

const route = useRoute()
const router = useRouter()

// Use the unified orders store
const ordersStore = useOrdersStore()
const {adminOrders: orders, loading, error, adminStats: stats} = storeToRefs(ordersStore)

// Pagination with query params
const currentPage = computed({
  get: () => parseInt(route.query.page as string) || 1,
  set: (page: number) => {
    router.push({query: {...route.query, page: page.toString()}})
  }
})
const perPage = 25

// Status filter options
const statusFilters = [
  {label: 'All Orders', value: null},
  {label: 'New', value: 'pending' as const},
  {label: 'Preparing', value: 'preparing' as const},
  {label: 'Ready', value: 'ready' as const}
]

// Payment filter options
const paymentFilters = [
  {label: 'All Payments', value: null},
  {label: 'Paid', value: 'paid' as const},
  {label: 'Unpaid', value: 'pending' as const}
]

// Reactive state
const selectedStatus = ref<Order['status'] | null>(null)
const selectedPaymentStatus = ref<'paid' | 'pending' | null>(null)
const showOrderModal = ref(false)
const selectedOrder = ref<OrderWithCustomer | null>(null)

// Transform stats for reusable DataStatistics component
const orderStats = computed(() => [
  {
    label: 'Total Orders Today',
    value: stats.value?.todayOrders || 0
  },
  {
    label: 'New Orders',
    value: stats.value?.pending || 0
  },
  {
    label: 'Preparing',
    value: stats.value?.preparing || 0
  },
  {
    label: 'Paid Orders',
    value: orders.value?.filter((order) => order.payment_status === 'paid').length || 0
  },
  {
    label: 'Unpaid Orders',
    value: orders.value?.filter((order) => order.payment_status === 'pending').length || 0
  },
  {
    label: 'Revenue Today',
    value: stats.value?.todayRevenue || '0',
    suffix: 'JD'
  }
])

const filteredOrders = computed(() => {
  if (!orders.value) return []
  let filtered = orders.value

  // Filter by order status
  if (selectedStatus.value) {
    filtered = filtered.filter((order) => order.status === selectedStatus.value)
  }

  // Filter by payment status
  if (selectedPaymentStatus.value) {
    filtered = filtered.filter((order) => order.payment_status === selectedPaymentStatus.value)
  }

  return filtered
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredOrders.value.slice(start, end)
})

const pagination = computed(() => ({
  page: currentPage.value,
  perPage: perPage,
  totalItems: filteredOrders.value.length,
  totalPages: Math.ceil(filteredOrders.value.length / perPage)
}))

// Navigation functions
const goToNextPage = () => {
  if (currentPage.value < pagination.value.totalPages) {
    currentPage.value = currentPage.value + 1
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1
  }
}

// Modal functions
const openOrderModal = (order: OrderWithCustomer) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

watch(selectedStatus, () => {
  currentPage.value = 1
})

watch(selectedPaymentStatus, () => {
  currentPage.value = 1
})
</script>
