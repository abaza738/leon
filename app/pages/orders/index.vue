<template>
  <div class="bg-white">
    <div class="mx-auto max-w-4xl py-16 sm:px-6 sm:py-24">
      <div class="px-4 sm:px-0">
        <!-- Back button -->
        <div class="mb-8">
          <Button
            @click="navigateTo('/')"
            variant="soft"
            size="sm"
            class="text-gray-500 hover:text-gray-700 bg-transparent hover:bg-gray-50"
          >
            <ChevronLeftIcon class="h-4 w-4" />
            Back to Menu
          </Button>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
        <p class="mt-2 text-sm text-gray-500"
          >Check the status of recent orders, manage payments, and view order details.</p
        >

        <!-- User Order Stats -->
        <div
          v-if="orders?.length"
          class="mt-8"
        >
          <DataStatistics
            :stats="orderStats"
            :columns="3"
          />
        </div>
      </div>

      <!-- Loading State -->
      <LoadingState
        v-if="loading"
        message="Loading orders..."
      />

      <!-- Error State -->
      <div
        v-else-if="error"
        class="mt-16 text-center py-16"
      >
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircleIcon class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-xl font-bold mb-2">Failed to load orders</h2>
        <p class="text-gray-600 mb-8">There was an error loading your order history</p>
        <Button
          @click="refresh()"
          variant="primary"
          size="lg"
        >
          Try Again
        </Button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!orders?.length"
        class="mt-16 text-center py-16"
      >
        <FileTextIcon class="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h2 class="text-2xl font-bold mb-3">No orders yet</h2>
        <p class="text-gray-600 mb-8 text-lg">Start ordering to see your order history</p>
        <Button
          @click="navigateTo('/')"
          variant="primary"
          size="xl"
        >
          <PlusIcon class="h-5 w-5" />
          Start Shopping
        </Button>
      </div>

      <!-- Orders List -->
      <div
        v-else
        class="mt-16"
      >
        <h2 class="sr-only">Recent orders</h2>

        <div class="space-y-16 sm:space-y-24">
          <div
            v-for="order in orders"
            :key="order.id"
          >
            <ClientOnly>
              <h3 class="sr-only"
                >Order placed on
                <time :datetime="order.created">{{ formatRelativeTime(order.created) }}</time></h3
              >
            </ClientOnly>

            <div
              class="bg-gray-50 px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8"
            >
              <dl
                class="flex-auto divide-y divide-gray-200 text-sm text-gray-600 md:grid md:grid-cols-3 md:gap-x-6 md:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8"
              >
                <div
                  class="max-md:flex max-md:justify-between max-md:py-4 max-md:first:pt-0 max-md:last:pb-0"
                >
                  <dt class="font-medium text-gray-900">Order number</dt>
                  <dd class="md:mt-1">{{ formatId(order.id) }}</dd>
                </div>
                <div
                  class="max-md:flex max-md:justify-between max-md:py-4 max-md:first:pt-0 max-md:last:pb-0"
                >
                  <dt class="font-medium text-gray-900">Date placed</dt>
                  <dd class="md:mt-1">
                    <time :datetime="order.created">{{ formatRelativeTime(order.created) }}</time>
                  </dd>
                </div>
                <div
                  class="max-md:flex max-md:justify-between max-md:py-4 max-md:first:pt-0 max-md:last:pb-0"
                >
                  <dt class="font-medium text-gray-900">Total amount</dt>
                  <dd class="font-medium text-gray-900 md:mt-1">{{
                    formatPrice(order.total_amount)
                  }}</dd>
                </div>
              </dl>
              <div class="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-4 md:mt-0">
                <!-- <button
                  @click="navigateTo(`/orders/${order.id}`)"
                  class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none md:w-auto"
                >
                  View Order
                  <span class="sr-only">{{ formatId(order.id) }}</span>
                </button> -->
                <div class="flex items-center">
                  <Badge :color="getOrderStatusColor(order.status)">
                    {{ getOrderStatusText(order.status) }}
                  </Badge>
                </div>
              </div>
            </div>

            <div class="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
              <div class="-my-6 divide-y divide-gray-200 sm:-my-10">
                <div class="flex py-6 sm:py-10">
                  <div class="min-w-0 flex-1 lg:flex lg:flex-col">
                    <div class="lg:flex-1">
                      <div class="sm:flex">
                        <div>
                          <h4 class="font-medium text-gray-900">Order Items</h4>
                          <p class="mt-2 text-sm text-gray-500">{{
                            order.notes || 'No special instructions'
                          }}</p>
                        </div>
                        <p class="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">{{
                          formatPrice(order.total_amount)
                        }}</p>
                      </div>
                      <div class="mt-2 flex text-sm font-medium sm:mt-4">
                        <Button
                          @click="navigateTo(`/orders/${order.id}`)"
                          variant="secondary"
                          size="sm"
                        >
                          View Order
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 shrink-0 sm:order-first sm:m-0 sm:mr-6">
                    <div
                      class="size-20 rounded-lg bg-gray-200 flex items-center justify-center sm:size-40 lg:size-52"
                    >
                      <FileTextIcon class="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ChevronLeftIcon, AlertCircleIcon, FileTextIcon, PlusIcon} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import DataStatistics from '~/components/admin/DataStatistics.vue'
import {formatPrice, formatId} from '~/utils/format'
import {calculateUserStats} from '~/utils/calculations'

definePageMeta({layout: 'user', name: 'orders', middleware: 'authenticated'})
useHead({titleTemplate: (t) => `${t} | My Orders`})

// Use the unified orders store
const ordersStore = useOrdersStore()
const {userOrders: orders, loading, error} = storeToRefs(ordersStore)

// Refresh function
const refresh = () => ordersStore.refreshUserOrders()

// Calculate user statistics using utility
const userStats = computed(() => calculateUserStats(orders.value || []))

// Transform stats for reusable DataStatistics component
const orderStats = computed(() => [
  {label: 'Total Orders', value: orders.value?.length || 0},
  {label: 'Total Spent', value: formatPrice(userStats.value.totalSpent)},
  {
    label: 'Pending Payment',
    value: formatPrice(userStats.value.pendingPayment)
  }
])
</script>
