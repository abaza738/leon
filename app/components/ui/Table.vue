<template>
  <div>
    <!-- Empty State -->
    <div
      v-if="!filteredOrders || filteredOrders.length === 0"
      class="text-center py-8"
    >
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileTextIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium mb-2">No orders found</h3>
      <p class="text-gray-500">No orders match the selected filter</p>
    </div>

    <!-- Orders Table -->
    <div v-else>
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold text-gray-900">Orders</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all orders including customer details, status, and total amount.
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
                      Order ID
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Ordered by
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Time
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
                  <tr
                    v-for="order in filteredOrders"
                    :key="order.id"
                  >
                    <td
                      class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                    >
                      {{ formatId(order.id) }}
                    </td>
                    <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {{ order.customer_name || order.expand?.customer?.name }}
                    </td>
                    <td class="px-3 py-4 text-sm whitespace-nowrap capitalize">
                      <Badge :color="getOrderStatusColor(order.status)">
                        {{ getOrderStatusText(order.status) }}
                      </Badge>
                    </td>
                    <td class="px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {{ formatPrice(order.total_amount) }}
                    </td>
                    <td class="px-3 py-4 text-sm whitespace-nowrap">
                      <Badge :color="order.payment_status === 'paid' ? 'green' : 'red'">
                        {{ order.payment_status === 'paid' ? 'Paid' : 'Unpaid' }}
                      </Badge>
                    </td>
                    <td
                      class="px-3 py-4 text-sm whitespace-nowrap"
                      :class="getTimeColor(order.created)"
                    >
                      {{ getRelativeTime(order.created) }}
                    </td>
                    <td
                      class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                    >
                      <div class="flex items-center justify-end gap-2">
                        <Button
                          @click="$emit('openOrderModal', order)"
                          variant="soft"
                          size="xs"
                        >
                          Manage<span class="sr-only"> , Order {{ formatId(order.id) }} </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :per-page="pagination.perPage"
        @previous="$emit('previousPage')"
        @next="$emit('nextPage')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {OrderWithCustomer} from '~/types/restaurant'
import {FileTextIcon} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import Pagination from '~/components/ui/Pagination.vue'
import {getOrderStatusColor, getOrderStatusText} from '~/utils/order-status'
import {formatPrice, formatId} from '~/utils/format'

// Use the reactive time composable
const {getRelativeTime, getTimeColor} = useRelativeTime()

type Props = {
  filteredOrders?: OrderWithCustomer[]
  pagination?: {
    page: number
    totalPages: number
    totalItems: number
    perPage: number
  }
}

type Emits = {
  openOrderModal: [order: OrderWithCustomer]
  previousPage: []
  nextPage: []
}

const {filteredOrders, pagination = {page: 1, totalPages: 1, totalItems: 0, perPage: 25}} =
  defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
/* Hide scrollbar for table overflow */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
