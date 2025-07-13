<template>
  <div class="p-6">
    <div class="mb-6">
      <UButton
        @click="navigateTo('/')"
        color="neutral"
        variant="ghost"
        size="sm"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="mr-2"
        />
        Back to Menu
      </UButton>
      <h1 class="text-2xl font-bold mt-4">My Orders</h1>
    </div>

    <LoadingState
      v-if="loading"
      message="Loading orders..."
    />

    <div
      v-else-if="error"
      class="py-4"
    >
      <UAlert
        icon="i-lucide-alert-circle"
        color="error"
        title="Failed to load orders"
        class="mb-4"
      />
      <UButton
        @click="refresh()"
        color="success"
        >Try Again</UButton
      >
    </div>

    <div
      v-else-if="!orders?.length"
      class="text-center py-8"
    >
      <UIcon
        name="i-lucide-receipt"
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium mb-2">No orders yet</h3>
      <p class="text-gray-500 mb-4">Start ordering to see your order history</p>
      <UButton
        @click="navigateTo('/')"
        color="success"
        >Start Shopping</UButton
      >
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <UCard
        v-for="order in orders"
        :key="order.id"
        class="cursor-pointer hover:shadow-md"
        @click="navigateTo(`/orders/${order.id}`)"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-medium">Order #{{ order.id.slice(-8) }}</h3>
              <UBadge
                :color="getOrderStatusColor(order.status)"
                size="sm"
              >
                {{ getOrderStatusText(order.status) }}
              </UBadge>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <p>{{ formatDate(order.created) }}</p>
              <p>Total: {{ order.total_amount.toFixed(2) }} JD</p>
              <p
                v-if="order.notes"
                class="text-gray-500"
                >{{ order.notes }}</p
              >
            </div>
          </div>
          <UIcon
            name="i-lucide-chevron-right"
            class="w-4 h-4 text-gray-400"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', name: 'orders', middleware: 'authenticated' })
useHead({ titleTemplate: (t) => `${t} | My Orders` })

const {
  orders,
  loading,
  error,
  refresh,
  getOrderStatusColor,
  getOrderStatusText,
} = useOrders()

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>
