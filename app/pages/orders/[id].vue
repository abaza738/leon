<template>
  <div class="p-6">
    <div class="mb-6">
      <UButton
        @click="navigateTo('/orders')"
        color="neutral"
        variant="ghost"
        size="sm"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="mr-2"
        />
        Back to Orders
      </UButton>
    </div>

    <LoadingState
      v-if="pending"
      message="Loading order details..."
    />

    <div
      v-else-if="error"
      class="py-6"
    >
      <UAlert
        icon="i-lucide-alert-circle"
        color="error"
        title="Failed to load order"
      />
    </div>

    <div
      v-else-if="data?.order"
      class="space-y-6"
    >
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold"
                >Order #{{ data.order.id.slice(-8) }}</h1
              >
              <p class="text-sm text-gray-600 mt-1"
                >Placed on {{ formatDate(data.order.created) }}</p
              >
            </div>
            <UBadge
              :color="getOrderStatusColor(data.order.status)"
              variant="soft"
              size="lg"
            >
              {{ getOrderStatusText(data.order.status) }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-if="data.order.notes"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <h3 class="font-medium mb-2">Special Instructions</h3>
            <p class="text-gray-700">{{ data.order.notes }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Order Items</h2>
        </template>

        <div
          v-if="data.items?.length"
          class="space-y-4"
        >
          <div
            v-for="item in data.items"
            :key="item.id"
            class="flex items-center gap-4 p-4 border rounded-lg"
          >
            <img
              :src="getProductImageUrl(item.expand?.product)"
              :alt="item.expand?.product?.name"
              class="w-16 h-16 object-cover rounded-lg"
            />

            <div class="flex-1">
              <h3 class="font-medium">{{ item.expand?.product?.name }}</h3>
              <p class="text-sm text-gray-600">{{
                item.expand?.product?.description
              }}</p>
              <div class="flex items-center gap-4 mt-2">
                <span class="text-sm text-gray-500"
                  >Qty: {{ item.quantity }}</span
                >
                <span class="text-sm text-gray-500"
                  >@ {{ item.unit_price.toFixed(2) }} JD</span
                >
                <span class="font-semibold"
                  >{{ item.subtotal.toFixed(2) }} JD</span
                >
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span class="text-emerald-600"
                >{{ data.order.total_amount.toFixed(2) }} JD</span
              >
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-8"
        >
          <UIcon
            name="i-lucide-package"
            class="w-12 h-12 text-gray-400 mx-auto mb-3"
          />
          <p class="text-gray-600">No items found for this order</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '~/types/restaurant'

// Extended type for OrderItem with expanded product
type OrderItemExpanded = OrderItem & { expand?: { product?: any } }

definePageMeta({
  layout: 'user',
  name: 'order-details',
  middleware: 'authenticated',
})

const route = useRoute()
const orderId = route.params.id as string

useHead({ titleTemplate: (t) => `${t} | Order Details` })

const { getOrderById, getOrderItems, getOrderStatusColor, getOrderStatusText } =
  useOrders()
const { getProductImageUrl } = useProducts()

const { data, pending, error } = useAsyncData(`order-${orderId}`, async () => {
  const [order, items] = await Promise.all([
    getOrderById(orderId),
    getOrderItems(orderId) as Promise<OrderItemExpanded[]>,
  ])
  return { order, items }
})

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement
//   target.src = '/placeholder-food.svg'
// }
</script>
