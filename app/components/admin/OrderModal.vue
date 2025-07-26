<template>
  <Dialog
    v-model:open="open"
    title="Order Management"
    description="View order details and update status and payment information."
    max-width="lg"
  >
    <div
      v-if="order"
      class="space-y-6"
    >
      <!-- Customer and Time Info -->
      <div class="text-sm">
        <span class="font-medium text-gray-700">Ordered by</span>
        <span class="ml-1 text-gray-900 font-medium">
          {{ order.customer_name || order.expand?.customer?.name }}
        </span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-gray-600">{{ formatRelativeTime(order.created) }}</span>
      </div>

      <!-- Order Header -->
      <div
        class="text-center p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100"
      >
        <p class="font-mono text-lg font-bold text-gray-900 mb-1">
          {{ formatId(order.id) }}
        </p>
        <p class="text-2xl font-bold text-indigo-600">
          {{ formatPrice(order.total_amount) }}
        </p>
      </div>

      <!-- Order Notes -->
      <div
        v-if="order.notes"
        class="p-3 bg-gray-50 rounded"
      >
        <span class="font-medium text-sm">Notes:</span>
        <p class="mt-1 text-sm">{{ order.notes }}</p>
      </div>

      <!-- Order Items -->
      <div>
        <div class="flex items-center mb-4">
          <h4 class="font-semibold text-gray-900">Order Items</h4>
        </div>

        <!-- Loading state -->
        <div
          v-if="loadingItems"
          class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg"
        >
          <p>Loading items...</p>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="items.length === 0"
          class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg"
        >
          <p>No items found</p>
        </div>

        <!-- Items list -->
        <div
          v-else
          class="space-y-3"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <NuxtLink
                  :to="`/products/${item.expand?.product?.id}`"
                  class="font-medium text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {{ item.expand?.product?.name }}
                </NuxtLink>
                <p class="text-sm text-gray-500 mt-1">
                  {{ item.quantity }} × {{ formatPrice(item.unit_price) }}
                </p>

                <!-- Customizations -->
                <div
                  v-if="item.selected_addons && Object.keys(item.selected_addons).length > 0"
                  class="mt-2"
                >
                  <p class="text-xs font-medium text-gray-600 mb-1">Customizations:</p>
                  <div class="flex flex-wrap gap-1">
                    <template
                      v-for="(addons, groupId) in item.selected_addons"
                      :key="groupId"
                    >
                      <span
                        v-for="addon in Array.isArray(addons) ? addons : [addons]"
                        :key="addon.id"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {{ getAddonDisplayText(addon) }}
                      </span>
                    </template>
                  </div>
                </div>

                <!-- Special Instructions -->
                <div
                  v-if="item.special_instructions"
                  class="mt-2"
                >
                  <p class="text-xs font-medium text-gray-600 mb-1">Special Instructions:</p>
                  <p
                    class="text-xs text-gray-500 italic bg-yellow-50 p-2 rounded border-l-2 border-yellow-200"
                  >
                    "{{ item.special_instructions }}"
                  </p>
                </div>
              </div>

              <div class="text-right ml-4">
                <p class="font-semibold text-gray-900">
                  {{ formatPrice(item.total_price) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Section -->
      <div class="pt-6 bg-gray-50 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-gray-900">Update Order</h4>
          <div
            v-if="hasChanges"
            class="flex items-center text-sm text-amber-600"
          >
            <div class="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
            Unsaved changes
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <Select
              v-model="formStatus"
              :options="ORDER_STATUS_CONFIG"
              label="Status"
              id="order-status-select"
              placeholder="Select status..."
            />
          </div>

          <div>
            <label
              for="paid-status"
              class="block text-sm/6 font-medium text-gray-900"
            >
              Payment Status
            </label>
            <div class="flex items-center justify-between mt-2">
              <span class="text-sm font-medium text-gray-700">
                {{ formPaidStatus ? 'Paid' : 'Unpaid' }}
              </span>
              <button
                @click="formPaidStatus = !formPaidStatus"
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden',
                  formPaidStatus ? 'bg-indigo-600' : 'bg-gray-200'
                ]"
                role="switch"
                :aria-checked="formPaidStatus"
              >
                <span class="sr-only">Toggle payment status</span>
                <span
                  :class="[
                    'pointer-events-none relative inline-block size-5 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out',
                    formPaidStatus ? 'translate-x-5' : 'translate-x-0'
                  ]"
                >
                  <!-- X icon for unpaid -->
                  <span
                    :class="[
                      'absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in',
                      formPaidStatus
                        ? 'opacity-0 duration-100 ease-out'
                        : 'opacity-100 duration-200 ease-in'
                    ]"
                    aria-hidden="true"
                  >
                    <X class="size-3 text-gray-400" />
                  </span>
                  <!-- Check icon for paid -->
                  <span
                    :class="[
                      'absolute inset-0 flex size-full items-center justify-center transition-opacity duration-100 ease-out',
                      formPaidStatus
                        ? 'opacity-100 duration-200 ease-in'
                        : 'opacity-0 duration-100 ease-out'
                    ]"
                    aria-hidden="true"
                  >
                    <Check class="size-3 text-indigo-600" />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        @click="handleUpdate"
        :disabled="updating || !hasChanges"
        type="button"
        variant="primary"
        size="md"
        class="w-full sm:ml-3 sm:w-auto"
      >
        <span v-if="updating">Updating...</span>
        <span v-else-if="hasChanges">Update Order</span>
        <span v-else>No Changes</span>
      </Button>
      <Button
        @click="handleClose"
        type="button"
        variant="secondary"
        size="md"
        class="mt-3 w-full sm:mt-0 sm:w-auto"
      >
        Close
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type {OrderWithCustomer} from '~/types/restaurant'
import {X, Check} from 'lucide-vue-next'

import {ORDER_STATUS_CONFIG} from '~/constants/order-status'

const props = defineProps<{order: OrderWithCustomer | null}>()
const emit = defineEmits<{updated: []}>()

const open = defineModel<boolean>('open', {default: false})

const {success, error: showError} = useToast()
const ordersStore = useOrdersStore()

const updating = ref(false)
const formStatus = ref('')
const formPaidStatus = ref(false)

watch(
  () => props.order,
  (order) => {
    if (order) {
      formStatus.value = order.status
      formPaidStatus.value = order.payment_status === 'paid'
    }
  },
  {immediate: true}
)

const orderDetailsResult = computed(() => {
  if (!props.order?.id) return null
  return ordersStore.getOrderDetails(props.order.id)
})

const orderDetails = computed(() => {
  const result = orderDetailsResult.value
  return result?.data?.value || null
})

const loadingItems = computed(() => {
  const result = orderDetailsResult.value
  return result?.pending?.value || false
})

const items = computed(() => orderDetails.value?.items || [])

const hasChanges = computed(() => {
  if (!props.order) return false
  return (
    formStatus.value !== props.order.status ||
    (formPaidStatus.value ? 'paid' : 'pending') !== props.order.payment_status
  )
})

const handleClose = () => {
  open.value = false
}

async function handleUpdate() {
  if (!props.order) return

  updating.value = true
  try {
    const updates: Record<string, any> = {}

    if (formStatus.value !== props.order.status) {
      updates.status = formStatus.value
    }

    const paymentStatus = formPaidStatus.value ? 'paid' : 'pending'
    if (paymentStatus !== props.order.payment_status) {
      updates.payment_status = paymentStatus
    }

    if (Object.keys(updates).length > 0) {
      await ordersStore.updateOrder(props.order.id, updates)
      success(`Order ${formatId(props.order.id)} updated successfully`)
      emit('updated')
      open.value = false
    } else {
      showError('No changes to update')
    }
  } catch (err) {
    console.error('Update error:', err)
    showError('Failed to update order')
  } finally {
    updating.value = false
  }
}
</script>
