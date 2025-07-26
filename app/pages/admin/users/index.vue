<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Orders by Users</h1>
      <p class="text-gray-600 mt-1">Comprehensive view of all users and their order history</p>
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
      <!-- Summary Stats -->
      <DataStatistics :stats="userStats" />

      <!-- Users Table -->
      <div>
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold text-gray-900">Users</h1>
            <p class="mt-2 text-sm text-gray-700">
              A list of all users including their order history, payment status, and spending
              details.
            </p>
          </div>
        </div>
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 scrollbar-hide">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden ring-1 shadow-sm ring-black/5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Orders
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Total Spent
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Pending
                      </th>
                      <th
                        scope="col"
                        class="relative py-3.5 pr-4 pl-3 sm:pr-6"
                      >
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <template
                      v-for="userData in paginatedUserOrders"
                      :key="userData.user.id"
                    >
                      <!-- Main User Row -->
                      <tr>
                        <td class="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-8 w-8">
                              <div
                                class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
                              >
                                <img
                                  v-if="
                                    userData.user.avatar &&
                                    getFileUrl(userData.user, userData.user.avatar)
                                  "
                                  :src="getFileUrl(userData.user, userData.user.avatar)"
                                  :alt="userData.user.name"
                                  class="h-8 w-8 rounded-full object-cover"
                                />
                                <UserIcon
                                  v-else
                                  class="h-4 w-4 text-gray-500"
                                />
                              </div>
                            </div>
                            <div class="ml-3">
                              <div class="text-sm font-medium">
                                <NuxtLink
                                  :to="`/admin/users/${userData.user.id}`"
                                  class="text-indigo-600 hover:text-indigo-900 hover:underline"
                                >
                                  {{ userData.user.name }}
                                </NuxtLink>
                              </div>
                              <div class="text-sm text-gray-500">
                                {{ formatId(userData.user.id) }}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <div class="text-sm text-gray-900">{{ userData.user.email }}</div>
                          <div class="text-sm text-gray-500">
                            {{ userData.user.phone ? `+962${userData.user.phone}` : 'No phone' }}
                          </div>
                        </td>
                        <td class="px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {{ userData.orders.length }}
                        </td>
                        <td class="px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {{ formatPrice(userData.totalSpent) }}
                        </td>
                        <td class="px-3 py-4 text-sm whitespace-nowrap">
                          <span
                            :class="
                              userData.pendingAmount > 0
                                ? 'text-red-600 font-medium'
                                : 'text-gray-400'
                            "
                          >
                            {{ formatPrice(userData.pendingAmount) }}
                          </span>
                        </td>
                        <td
                          class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                        >
                          <NuxtLink
                            :to="`/admin/users/${userData.user.id}`"
                            class="text-indigo-600 hover:text-indigo-900"
                          >
                            View Orders
                            <span class="sr-only">, {{ userData.user.name }}</span>
                          </NuxtLink>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalUsers"
        :per-page="perPage"
        @previous="goToPreviousPage"
        @next="goToNextPage"
      />

      <!-- Empty State -->
      <div
        v-if="paginatedUserOrders.length === 0"
        class="text-center py-12"
      >
        <Users class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p class="mt-1 text-sm text-gray-500"> No users with orders have been found. </p>
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
import {AlertCircleIcon, Users, User as UserIcon} from 'lucide-vue-next'
import Badge from '~/components/ui/Badge.vue'
import LoadingState from '~/components/LoadingState.vue'
import DataStatistics from '~/components/admin/DataStatistics.vue'
import OrderModal from '~/components/admin/OrderModal.vue'
import Pagination from '~/components/ui/Pagination.vue'
import {getFileUrl} from '~/utils/pocketbase'
import {formatDate} from '~/utils/date'
import {formatPrice, formatId} from '~/utils/format'
import {getOrderStatusColor, getOrderStatusText} from '~/utils/order-status'

definePageMeta({layout: 'admin', middleware: ['authenticated', 'admin']})
useHead({titleTemplate: (t) => `${t} | Admin - Users & Orders`})

const route = useRoute()
const router = useRouter()

// Pagination with query params
const currentPage = computed({
  get: () => parseInt(route.query.page as string) || 1,
  set: (page: number) => {
    router.push({query: {...route.query, page: page.toString()}})
  }
})
const perPage = 25

// Use the orders store with user management
const {$pb} = useNuxtApp()
const {
  data: userOrdersData,
  pending: loading,
  error,
  refresh
} = useAsyncData('users-orders', async () => {
  try {
    // Get users who have orders
    const users = await $pb.collection('users').getList(1, 100, {
      filter: 'orders_via_customer.id != ""',
      sort: '-created',
      expand: 'orders_via_customer'
    })

    // Transform to match expected structure
    const usersWithOrderData = users.items.map((user: any) => {
      const orders = user.expand?.orders_via_customer || []
      return {
        user,
        orders,
        totalSpent: orders.reduce((sum: number, order: any) => sum + order.total_amount, 0),
        pendingAmount: orders
          .filter((order: any) => order.payment_status === 'pending')
          .reduce((sum: number, order: any) => sum + order.total_amount, 0)
      }
    })

    return {users: usersWithOrderData, totalUsers: users.totalItems}
  } catch (error) {
    console.error('Failed to fetch users with orders:', error)
    throw error
  }
})

// Reactive data for modal
const showOrderModal = ref(false)
const selectedOrder = ref<OrderWithCustomer | null>(null)

// Transform stats for reusable DataStatistics component
const userStats = computed(() => [
  {
    label: 'Total Users',
    value: userOrdersData.value?.users?.length || 0
  },
  {
    label: 'Total Orders',
    value: totalOrders.value
  },
  {
    label: 'Paid Orders',
    value: paidOrders.value
  },
  {
    label: 'Pending Payment',
    value: pendingPayments.value
  }
])

// Computed properties for pagination
const filteredUserOrders = computed(() => {
  return userOrdersData.value?.users || []
})

const totalUsers = computed(() => filteredUserOrders.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / perPage))

const paginatedUserOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredUserOrders.value.slice(start, end)
})

const totalOrders = computed(() => {
  if (!userOrdersData.value?.users) return 0
  return userOrdersData.value.users.reduce((sum, userData) => sum + userData.orders.length, 0)
})

const paidOrders = computed(() => {
  if (!userOrdersData.value?.users) return 0
  return userOrdersData.value.users.reduce((sum, userData) => {
    return sum + userData.orders.filter((order) => order.payment_status === 'paid').length
  }, 0)
})

const pendingPayments = computed(() => {
  if (!userOrdersData.value?.users) return 0
  return userOrdersData.value.users.reduce((sum, userData) => {
    return sum + userData.orders.filter((order) => order.payment_status === 'pending').length
  }, 0)
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

function openOrderModal(order: OrderWithCustomer) {
  selectedOrder.value = order
  showOrderModal.value = true
}

function handleOrderUpdated() {
  // Refresh data when an order is updated
  refresh()
}
</script>
