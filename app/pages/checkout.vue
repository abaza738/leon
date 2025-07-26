<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <!-- Back button -->
      <div class="mb-8">
        <NuxtLink
          to="/"
          class="flex gap-2 items-center"
        >
          <ChevronLeftIcon class="h-4 w-4" />
          Back to Menu
        </NuxtLink>
      </div>

      <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"> Shopping Cart </h1>

      <!-- Loading State -->
      <LoadingState
        v-if="isSubmitting && !orderSuccess"
        message="Processing your order..."
      />

      <!-- Success Modal -->
      <div
        v-if="orderSuccess"
        class="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckIcon class="size-6 text-green-600" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3
                    id="modal-title"
                    class="text-base font-semibold text-gray-900"
                  >
                    Order Placed Successfully!
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Your order {{ formatId(fullOrderId) }} has been placed and will be ready in
                      30-45 minutes.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 space-y-3">
                <Button
                  @click="navigateTo(`/orders/${fullOrderId}`)"
                  variant="primary"
                  size="lg"
                  class="w-full"
                >
                  Track Order
                </Button>
                <Button
                  @click="navigateTo('/')"
                  variant="secondary"
                  size="lg"
                  class="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div
        v-else-if="!hasItems"
        class="flex flex-col items-center justify-center py-20"
      >
        <ShoppingCartIcon class="w-20 h-20 text-gray-400 mb-6" />
        <h2 class="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p class="text-gray-600 mb-8 text-lg">Add some delicious items to get started</p>
        <Button
          @click="navigateTo('/')"
          variant="primary"
          size="xl"
        >
          <PlusIcon class="h-5 w-5" />
          Browse Menu
        </Button>
      </div>

      <!-- Cart Content -->
      <form
        v-else-if="!isSubmitting"
        class="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        @submit.prevent="handleSubmit"
      >
        <section
          aria-labelledby="cart-heading"
          class="lg:col-span-7"
        >
          <h2
            id="cart-heading"
            class="sr-only"
            >Items in your shopping cart</h2
          >

          <ul
            role="list"
            class="divide-y divide-gray-200 border-t border-b border-gray-200"
          >
            <li
              v-for="item in cartStore.cartItems"
              :key="item.id"
              class="flex py-6 sm:py-10"
            >
              <div class="shrink-0">
                <img
                  v-if="
                    item.expand?.product?.image &&
                    getFileUrl(item.expand.product, item.expand.product.image)
                  "
                  :src="getFileUrl(item.expand.product, item.expand.product.image)"
                  :alt="item.expand?.product?.name || 'Product'"
                  class="size-24 rounded-md object-cover sm:size-48"
                />
                <div
                  v-else
                  class="size-24 sm:size-48 bg-gray-200 rounded-md flex items-center justify-center"
                >
                  <ImageIcon class="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div class="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                  <div>
                    <div class="flex justify-between">
                      <h3 class="text-sm">
                        <NuxtLink
                          :to="`/products/${item.product}`"
                          class="font-medium text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {{ item.expand?.product?.name || 'Unknown Product' }}
                        </NuxtLink>
                      </h3>
                    </div>
                    <div class="mt-1 flex text-sm">
                      <p class="text-gray-500">{{
                        item.expand?.product?.description || 'No description available'
                      }}</p>
                    </div>

                    <!-- Addons -->
                    <div
                      v-if="item.selected_addons && Object.keys(item.selected_addons).length > 0"
                      class="mt-2"
                    >
                      <p class="text-xs text-gray-600 font-medium mb-1">Customizations:</p>
                      <!-- Detailed customizations list -->
                      <ul class="text-xs text-gray-600 space-y-0.5 pl-2">
                        <template
                          v-for="(addons, groupId) in item.selected_addons"
                          :key="groupId"
                        >
                          <li
                            v-for="addon in addons"
                            v-show="addon && typeof addon === 'object' && 'name' in addon"
                            :key="addon.id"
                            class="flex justify-between"
                          >
                            <span class="font-medium">{{ addon.name }}</span>
                            <span
                              class="font-medium"
                              :class="{
                                'text-indigo-600': addon.price > 0,
                                'text-green-600': addon.price === 0
                              }"
                            >
                              {{ addon.price > 0 ? `+${formatPrice(addon.price)}` : 'FREE' }}
                            </span>
                          </li>
                        </template>
                      </ul>
                    </div>

                    <div class="mt-1">
                      <div class="text-xs text-gray-600">
                        <!-- Show base price -->
                        <template v-if="item.quantity > 0">
                          {{ formatPrice(item.expand?.product?.base_price || 0) }}
                          × {{ item.quantity }}
                        </template>
                      </div>
                      <div
                        v-if="
                          item.item_total > (item.expand?.product?.base_price || 0) * item.quantity
                        "
                        class="text-xs text-gray-500"
                      >
                        +{{
                          formatPrice(
                            item.item_total -
                              (item.expand?.product?.base_price || 0) * item.quantity
                          )
                        }}
                        customizations
                      </div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ formatPrice(item.item_total) }} total
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 sm:mt-0 sm:pr-9">
                    <div class="grid w-full max-w-16 grid-cols-1">
                      <select
                        :key="`${item.id}-${item.quantity}`"
                        :value="item.quantity"
                        @change="
                          updateQuantity(
                            item.id,
                            parseInt(($event.target as HTMLSelectElement).value)
                          )
                        "
                        :aria-label="`Quantity, ${item.expand?.product?.name || 'Product'}`"
                        class="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option
                          v-for="n in Math.max(10, item.quantity + 2)"
                          :key="n"
                          :value="n"
                          :selected="n === item.quantity"
                        >
                          {{ n }}
                        </option>
                      </select>
                      <ChevronDownIcon
                        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </div>

                    <div class="absolute top-0 right-0">
                      <button
                        type="button"
                        @click="removeItem(item.id)"
                        class="text-red-400 hover:text-red-500"
                      >
                        <span class="sr-only">Remove</span>
                        <XIcon class="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <!-- Order summary -->
        <section
          aria-labelledby="summary-heading"
          class="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2
            id="summary-heading"
            class="text-lg font-medium text-gray-900"
          >
            Order summary
          </h2>

          <dl class="mt-6 space-y-4">
            <!-- <div class="flex items-center justify-between">
              <dt class="text-sm text-gray-600">Base items subtotal</dt>
              <dd class="text-sm font-medium text-gray-900">
                {{ formatPrice(priceBreakdown.baseTotal) }}
              </dd>
            </div> -->

            <div class="flex items-center justify-between">
              <dt class="text-base font-medium text-gray-900">Order total</dt>
              <dd class="text-base font-medium text-gray-900">
                {{ formatPrice(priceBreakdown.grandTotal) }}
              </dd>
            </div>
          </dl>

          <!-- Special Instructions -->
          <div class="mt-6">
            <label
              for="notes"
              class="block text-sm/6 font-medium text-gray-900 mb-2"
            >
              Special Instructions (optional)
            </label>
            <textarea
              id="notes"
              v-model="orderForm.notes"
              placeholder="Any special requests or dietary requirements..."
              rows="3"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>

          <div class="mt-6">
            <Button
              type="submit"
              :disabled="!hasItems || isSubmitting"
              variant="primary"
              size="lg"
              class="w-full"
            >
              <span v-if="isSubmitting"> Processing... </span>
              <span v-else>Place Order</span>
            </Button>
          </div>

          <!-- Clear Cart Button -->
          <div class="mt-4">
            <Button
              @click="handleClearCart"
              variant="secondary"
              size="lg"
              class="w-full"
            >
              Clear Cart
            </Button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import {formatPrice, formatId} from '~/utils/format'
import {calculateCustomizationsTotal, getAddonDisplayText} from '~/utils/calculations'
import {
  ChevronLeftIcon,
  ImageIcon,
  ShoppingCartIcon,
  PlusIcon,
  ChevronDownIcon,
  XIcon,
  CheckIcon
} from 'lucide-vue-next'

definePageMeta({
  layout: 'user',
  name: 'checkout',
  middleware: 'authenticated'
})

useHead({title: 'Checkout'})

const cartStore = useCartStore()
const ordersStore = useOrdersStore()

// Function to get addon display text
const getAddonDisplay = getAddonDisplayText

const isSubmitting = ref(false)
const orderSuccess = ref(false)
const orderForm = ref({notes: ''})
const fullOrderId = ref('')

const hasItems = computed(() => cartStore.cartItems?.length > 0)

// Calculate price breakdown using utility
const priceBreakdown = computed(() => calculateCustomizationsTotal(cartStore.cartItems || []))

const updateQuantity = async (cartItemId: string, quantity: number) => {
  try {
    await cartStore.updateQuantity(cartItemId, quantity)
  } catch (error) {
    console.error('Error updating quantity:', error)
  }
}

const removeItem = async (cartItemId: string) => {
  try {
    await cartStore.removeItem(cartItemId)
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

async function handleSubmit() {
  if (!hasItems.value) return

  isSubmitting.value = true

  try {
    const order = await ordersStore.createOrder(
      [...cartStore.cartItems],
      orderForm.value.notes?.trim() || ''
    )

    fullOrderId.value = order.id

    await cartStore.clearCart()
    orderSuccess.value = true
  } catch (err: any) {
    console.error('Order creation failed:', err)
  } finally {
    isSubmitting.value = false
  }
}

async function handleClearCart() {
  try {
    await cartStore.clearCart()
  } catch (err: any) {
    console.error('Error clearing cart:', err)
  }
}
</script>
