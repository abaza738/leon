<template>
  <div class="p-6">
    <!-- Back Button -->
    <div class="mb-8 flex items-center gap-4">
      <Button
        @click="$router.back()"
        variant="ghost"
        size="sm"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Users
      </Button>
    </div>

    <LoadingState
      v-if="loading"
      message="Loading user orders..."
    />

    <div
      v-else-if="error"
      class="rounded-md bg-red-50 p-4 mb-6"
    >
      <div class="flex">
        <UserIcon class="w-5 h-5 text-red-400 shrink-0" />
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
      <!-- User Header with consistent styling -->
      <div class="mb-8">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0 h-16 w-16">
            <div
              class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="userData?.user?.avatar && getFileUrl(userData.user, userData.user.avatar)"
                :src="getFileUrl(userData.user, userData.user.avatar)"
                :alt="userData.user?.name"
                class="h-16 w-16 rounded-full object-cover"
              />
              <UserIcon
                v-else
                class="h-8 w-8 text-gray-500"
              />
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">{{ userData?.user?.name }}</h1>
            <p class="text-gray-600 mt-1">{{ userData?.user?.email }}</p>
            <p class="text-gray-500">
              {{ userData?.user?.phone ? `+962${userData.user.phone}` : 'No phone number' }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <Badge
                v-if="userData?.user?.verified"
                color="green"
              >
                <UserIcon class="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Badge
                v-if="userData && userData.pendingAmount > 0"
                color="red"
              >
                Payment Due: {{ formatPrice(userData.pendingAmount) }}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats - same as admin pages -->
      <DataStatistics
        :stats="userDetailStats"
        :columns="3"
      />

      <!-- Orders Table -->
      <Table
        v-if="!loading && userData && paginatedOrders && paginatedOrders.length > 0"
        :filtered-orders="paginatedOrders"
        :pagination="{
          page: currentPage,
          totalPages: totalPages,
          totalItems: totalOrders,
          perPage: perPage
        }"
        @open-order-modal="openOrderModal"
        @previous-page="goToPreviousPage"
        @next-page="goToNextPage"
      />

      <!-- Empty State -->
      <div
        v-else-if="!loading && userData && (!paginatedOrders || paginatedOrders.length === 0)"
        class="text-center py-12"
      >
        <UserIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500"> This user hasn't placed any orders yet. </p>
      </div>
    </div>

    <!-- Order Modal -->
    <OrderModal
      v-model:open="showOrderModal"
      :order="selectedOrder"
      @updated="handleOrderUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import type {OrderWithCustomer} from '~/types/restaurant'
import {ArrowLeft, User as UserIcon} from 'lucide-vue-next'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'
import LoadingState from '~/components/LoadingState.vue'
import DataStatistics from '~/components/admin/DataStatistics.vue'
import OrderModal from '~/components/admin/OrderModal.vue'
import Table from '~/components/ui/Table.vue'
import {getFileUrl} from '~/utils/pocketbase'
import {formatPrice, formatId} from '~/utils/format'

definePageMeta({layout: 'admin', middleware: ['authenticated', 'admin']})

const route = useRoute()
const router = useRouter()

// Get user ID from route params
const userId = computed(() => route.params.id as string)

// Use direct PocketBase calls for user order details
const {$pb} = useNuxtApp()
const {
  data: userData,
  pending: loading,
  error,
  refresh
} = useAsyncData(
  () => `user-orders-${userId.value}`,
  async () => {
    try {
      // Get user's orders with customer data expanded
      const orders = await $pb.collection('orders').getList(1, 100, {
        filter: `customer = "${userId.value}"`,
        sort: '-created',
        expand: 'customer'
      })

      // Get user from first order (since all orders have same customer)
      const user = orders.items[0]?.expand?.customer

      return {
        user,
        orders: orders.items,
        totalSpent: orders.items.reduce((sum: number, order: any) => sum + order.total_amount, 0),
        pendingAmount: orders.items
          .filter((order: any) => order.payment_status === 'pending')
          .reduce((sum: number, order: any) => sum + order.total_amount, 0)
      }
    } catch (error) {
      console.error('Failed to fetch user orders:', error)
      throw error
    }
  },
  {watch: [userId]}
)

// Transform stats for reusable DataStatistics component
const userDetailStats = computed(() => [
  {label: 'Total Orders', value: userData.value?.orders?.length || 0},
  {label: 'Total Spent', value: formatPrice(userData.value?.totalSpent || 0)},
  {
    label: 'Pending Payment',
    value: formatPrice(userData.value?.pendingAmount || 0)
  }
])

// Pagination with query params
const currentPage = computed({
  get: () => parseInt(route.query.page as string) || 1,
  set: (page: number) => {
    router.push({query: {...route.query, page: page.toString()}})
  }
})
const perPage = 25

// Reactive data for modal
const showOrderModal = ref(false)
const selectedOrder = ref<OrderWithCustomer | null>(null)

// Set page title
useHead(() => ({
  titleTemplate: (t) => `${t} | Admin - ${userData.value?.user?.name || 'User Orders'}`
}))

// Computed properties for pagination
const filteredOrders = computed(() => {
  return userData.value?.orders || []
})

const totalOrders = computed(() => filteredOrders.value.length)
const totalPages = computed(() => Math.ceil(totalOrders.value / perPage))

const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage
  const endIndex = startIndex + perPage
  return filteredOrders.value.slice(startIndex, endIndex)
})

// Navigation functions
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value = currentPage.value + 1
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1
  }
}

// Modal functions
function openOrderModal(order: OrderWithCustomer) {
  selectedOrder.value = order
  showOrderModal.value = true
}

function handleOrderUpdated() {
  // Refresh data when an order is updated
  refresh()
}
</script>
