<template>
  <div class="mx-auto max-w-2xl w-full pt-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
    <!-- Back Navigation -->
    <div class="mb-6 px-4 sm:px-0">
      <Button
        @click="navigateTo('/orders')"
        variant="soft"
        size="sm"
        class="text-indigo-600 hover:text-indigo-500 bg-transparent hover:bg-indigo-50"
      >
        <ChevronLeft class="w-4 h-4" />
        Back to Orders
      </Button>
    </div>

    <!-- Loading State - Only show on initial load when no data exists -->
    <LoadingState
      v-if="!orderData && pending"
      message="Loading order details..."
    />

    <!-- Error State -->
    <div
      v-else-if="error"
      class="mt-16 text-center py-16"
    >
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-10 h-10 text-red-500" />
      </div>
      <h2 class="text-xl font-bold mb-2">Failed to load order</h2>
      <p class="text-gray-600 mb-8">There was an error loading your order details</p>
      <Button
        @click="refresh()"
        variant="primary"
        size="lg"
      >
        Try Again
      </Button>
    </div>

    <!-- Order Content -->
    <div
      v-else-if="order"
      class="relative"
    >
      <!-- Order Header -->
      <div class="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
        <div class="flex sm:items-baseline sm:space-x-4">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
            >Order {{ formatId(order.id) }}</h1
          >
          <Badge :color="getOrderStatusColor(order.status)">
            {{ getOrderStatusText(order.status) }}
          </Badge>
        </div>
        <div class="flex items-center space-x-4">
          <p class="text-sm text-gray-600"
            >Order placed
            <time
              :datetime="order.created"
              class="font-medium text-gray-900"
              >{{ formatRelativeTime(order.created) }}</time
            ></p
          >
        </div>
      </div>

      <!-- Order Status Tracking - Moved to top -->
      <div class="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
        <p class="text-sm font-medium text-gray-900 mb-6">
          <Badge
            :color="getOrderStatusColor(order.status)"
            class="mr-2"
          >
            {{ getOrderStatusText(order.status) }}
          </Badge>
          Last updated
          <time
            :datetime="order.updated"
            class="font-medium"
            >{{ formatRelativeTime(order.updated) }}</time
          >
        </p>
        <div
          class="mt-6"
          aria-hidden="true"
        >
          <div class="overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-2 rounded-full bg-indigo-600"
              :style="`width: ${getOrderStatusProgress(order.status)}%`"
            ></div>
          </div>
          <div class="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
            <div :class="['text-indigo-600']">Order placed</div>
            <div
              :class="[
                'text-center',
                order.status === 'confirmed' ||
                order.status === 'preparing' ||
                order.status === 'ready' ||
                order.status === 'delivered'
                  ? 'text-indigo-600'
                  : ''
              ]"
              >Processing</div
            >
            <div
              :class="[
                'text-center',
                order.status === 'preparing' ||
                order.status === 'ready' ||
                order.status === 'delivered'
                  ? 'text-indigo-600'
                  : ''
              ]"
              >Preparing</div
            >
            <div :class="['text-right', order.status === 'delivered' ? 'text-indigo-600' : '']"
              >Delivered</div
            >
          </div>
        </div>
      </div>

      <!-- Horizontal Separator -->
      <hr class="mt-8 border-gray-200" />

      <!-- Products -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Items in your order</h2>

        <!-- Single card containing all items -->
        <div class="border border-gray-200 bg-white shadow-sm rounded-lg">
          <div class="px-4 py-6 sm:px-6 lg:px-8">
            <div class="space-y-6">
              <div
                v-for="item in items"
                :key="item.id"
                class="flex border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
              >
                <div class="shrink-0">
                  <img
                    v-if="
                      item.expand?.product?.image &&
                      getFileUrl(item.expand.product, item.expand.product.image)
                    "
                    :src="getFileUrl(item.expand.product, item.expand.product.image)"
                    :alt="item.expand?.product?.name || 'Product'"
                    class="w-20 h-20 rounded-lg object-cover"
                  />
                  <div
                    v-else
                    class="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center"
                  >
                    <ImageIcon class="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div class="ml-4 flex-1">
                  <h3 class="text-base font-medium text-gray-900">
                    <NuxtLink
                      :to="`/products/${item.expand?.product?.id}`"
                      class="hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {{ item.expand?.product?.name || 'Unknown Product' }}
                    </NuxtLink>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">{{
                    item.expand?.product?.description || 'No description available'
                  }}</p>

                  <!-- Addons - Display actual names and prices -->
                  <div
                    v-if="item.selected_addons && Object.keys(item.selected_addons).length > 0"
                    class="mt-2"
                  >
                    <p class="text-sm font-medium text-gray-700 mb-1">Customizations:</p>
                    <div class="flex flex-wrap gap-1">
                      <template
                        v-for="(addons, groupId) in item.selected_addons"
                        :key="groupId"
                      >
                        <span
                          v-for="addon in addons"
                          :key="addon.id"
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {{ addon.name
                          }}{{ addon.price > 0 ? ` (+${formatPrice(addon.price)})` : '' }}
                        </span>
                      </template>
                    </div>
                  </div>

                  <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <p class="text-sm text-gray-600">{{ formatPrice(item.unit_price) }} each</p>
                      <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
                    </div>
                    <p class="text-sm font-medium text-gray-900">{{
                      formatPrice(item.unit_price * item.quantity)
                    }}</p>
                  </div>

                  <!-- Review Button (only for delivered orders) -->
                  <div
                    v-if="order.status === 'delivered'"
                    class="mt-3"
                  >
                    <Button
                      v-if="!hasExistingReview(item)"
                      @click="openReviewModal(item)"
                      variant="secondary"
                      size="sm"
                    >
                      <StarIcon class="w-4 h-4 mr-1" />
                      Write Review
                    </Button>
                    <div
                      v-else
                      class="flex items-center text-sm text-green-600"
                    >
                      <StarIcon class="w-4 h-4 mr-1 fill-current" />
                      Review submitted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="!items?.length"
            class="text-center py-8"
          >
            <Package class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-600">No items found for this order</p>
          </div>
        </div>
      </div>

      <!-- Special Instructions -->
      <div
        v-if="order.notes"
        class="mt-8 bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:px-8 lg:py-8"
      >
        <h3 class="font-medium text-gray-900 mb-2">Special Instructions</h3>
        <p class="text-gray-700">{{ order.notes }}</p>
      </div>

      <!-- Billing Summary -->
      <div class="mt-16">
        <h2 class="sr-only">Billing Summary</h2>

        <div
          class="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8"
        >
          <dl class="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
            <div>
              <dt class="font-medium text-gray-900">Customer Information</dt>
              <dd class="mt-3 text-gray-500">
                <span class="block">{{ order.customer_name || order.expand?.customer?.name }}</span>
                <span class="block">{{
                  order.expand?.customer?.email || 'Email not provided'
                }}</span>
                <span class="block">{{
                  order.customer_floor
                    ? `Floor ${order.customer_floor}`
                    : order.expand?.customer?.floor_number
                      ? `Floor ${order.expand.customer.floor_number}`
                      : 'Floor not provided'
                }}</span>
                <span class="block">{{
                  order.expand?.customer?.phone
                    ? `+962${order.expand.customer.phone}`
                    : 'Phone not provided'
                }}</span>
              </dd>
            </div>
            <div>
              <dt class="font-medium text-gray-900">Payment information</dt>
              <dd class="-mt-1 -ml-4 flex flex-wrap">
                <div class="mt-4 ml-4 shrink-0">
                  <div class="h-6 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <span class="text-xs text-gray-600">CASH</span>
                  </div>
                </div>
                <div class="mt-4 ml-4 flex-1">
                  <p class="text-gray-900">Cash on Delivery</p>
                  <div class="flex items-center gap-2 mt-1">
                    <Badge :color="order.payment_status === 'paid' ? 'green' : 'red'">
                      {{ order.payment_status === 'paid' ? 'Paid' : 'Payment Pending' }}
                    </Badge>
                    <span
                      v-if="order.payment_status === 'pending'"
                      class="text-sm text-red-600 font-medium"
                    >
                      {{ formatPrice(order.total_amount) }} Due
                    </span>
                  </div>
                </div>
              </dd>
            </div>
          </dl>

          <dl class="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
            <div class="flex items-center justify-between pb-4">
              <dt class="text-gray-600">Subtotal</dt>
              <dd class="font-medium text-gray-900">{{ formatPrice(order.total_amount) }}</dd>
            </div>
            <div class="flex items-center justify-between pt-4">
              <dt class="font-medium text-gray-900">Order total</dt>
              <dd class="font-medium text-indigo-600">{{ formatPrice(order.total_amount) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>

  <!-- Review Modal -->
  <ReviewModal
    v-if="selectedItem"
    :is-open="reviewModalOpen"
    :order-id="orderId"
    :product-id="selectedItem?.expand?.product?.id"
    :product-name="selectedItem?.expand?.product?.name || 'Product'"
    @update:open="reviewModalOpen = $event"
    @review-submitted="handleReviewSubmitted"
  />
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import {ChevronLeft, AlertCircle, ImageIcon, Package, StarIcon} from 'lucide-vue-next'
import {getOrderStatusColor, getOrderStatusText, getOrderStatusProgress} from '~/utils/order-status'
import {formatRelativeTime} from '~/utils/date'
import {getFileUrl} from '~/utils/pocketbase'
import {formatPrice, formatId} from '~/utils/format'
import ReviewModal from '~/components/ReviewModal.vue'

definePageMeta({
  layout: 'user',
  name: 'order-details',
  middleware: 'authenticated'
})

const {params} = useRoute()
const orderId = params.id as string

useHead({titleTemplate: (t) => `${t} | Order Details`})

// Use the unified orders store
const ordersStore = useOrdersStore()
const {getOrderReviews} = useReviews()

// Get order details using the working pattern
const orderDetailsResponse = await ordersStore.getOrderDetails(orderId)
const {data: orderData, pending, error, refresh} = orderDetailsResponse

const {data: existingReviews, refresh: refreshReviews} = await getOrderReviews(orderId)

// Computed properties with safe access
const order = computed(() => orderData?.value?.order || null)
const items = computed(() => orderData?.value?.items || [])

// Review modal state
const reviewModalOpen = ref(false)
const selectedItem = ref<any>(null)

function openReviewModal(item: any) {
  selectedItem.value = item
  reviewModalOpen.value = true
}

async function handleReviewSubmitted() {
  await refreshReviews()
}

function hasExistingReview(item: any) {
  if (!item.expand?.product?.id || !existingReviews.value) return false
  return existingReviews.value.has(item.expand.product.id)
}
</script>
