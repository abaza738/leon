<template>
  <Drawer
    ref="drawerRef"
    title="Shopping Cart"
    description="Review your items before checkout"
    size="md"
    @close="$emit('close')"
  >
    <template #trigger>
      <button
        class="group -m-2 flex items-center p-2 cursor-pointer"
        :aria-label="`View cart with ${cartCount} items`"
      >
        <ShoppingBag class="size-6 shrink-0 text-gray-400 group-hover:text-gray-500" />
        <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {{ cartCount }}
        </span>
        <span class="sr-only">items in cart, view bag</span>
      </button>
    </template>

    <!-- Empty Cart State -->
    <div
      v-if="isEmpty"
      class="flex flex-col items-center justify-center py-12"
    >
      <ShoppingBag class="w-16 h-16 text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
      <p class="text-gray-500 text-center mb-6">Add some delicious items to get started</p>
      <Button
        @click="drawerRef?.close()"
        variant="primary"
        size="md"
      >
        Continue Shopping
      </Button>
    </div>

    <!-- Cart Items -->
    <div
      v-else
      class="mt-4"
    >
      <div class="flow-root">
        <ul
          role="list"
          class="-my-6 divide-y divide-gray-200"
        >
          <li
            v-for="item in cartStore.cartItems"
            :key="item.id"
            class="flex py-6"
          >
            <div class="size-20 shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                v-if="
                  item.expand?.product?.image &&
                  getFileUrl(item.expand.product, item.expand.product.image)
                "
                :src="getFileUrl(item.expand.product, item.expand.product.image)"
                :alt="item.expand?.product?.name || 'Product'"
                class="size-full object-cover"
              />
              <div
                v-else
                class="size-full bg-gray-200 flex items-center justify-center"
              >
                <ImageIcon class="w-6 h-6 text-gray-400" />
              </div>
            </div>

            <div class="ml-4 flex flex-1 flex-col">
              <div>
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <NuxtLink
                      :to="`/products/${item.product}`"
                      class="hover:text-indigo-600 transition-colors"
                      @click="drawerRef?.close()"
                    >
                      {{ item.expand?.product?.name || 'Unknown Product' }}
                    </NuxtLink>
                  </h3>
                  <p class="ml-4">{{ formatPrice(item.item_total) }}</p>
                </div>

                <!-- Customizations -->
                <div
                  v-if="item.selected_addons && Object.keys(item.selected_addons).length > 0"
                  class="mt-1"
                >
                  <div class="text-xs text-gray-600 space-y-0.5">
                    <template
                      v-for="(addons, groupId) in item.selected_addons"
                      :key="groupId"
                    >
                      <div
                        v-for="addon in addons"
                        v-show="addon && typeof addon === 'object' && 'name' in addon"
                        :key="addon.id"
                        class="flex justify-between"
                      >
                        <span>+ {{ addon.name }}</span>
                        <span v-if="addon.price > 0">+{{ formatPrice(addon.price) }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="flex flex-1 items-end justify-between text-sm">
                <p class="text-gray-500">Qty {{ item.quantity }}</p>

                <div class="flex">
                  <button
                    type="button"
                    @click="removeItem(item.id)"
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <template
      #footer
      v-if="!isEmpty"
    >
      <div class="space-y-4">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>{{ formatPrice(cartStore.cartTotal) }}</p>
        </div>
        <p class="text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>

        <div class="space-y-2">
          <Button
            @click="goToCheckout"
            variant="primary"
            size="lg"
            class="w-full"
          >
            Checkout
          </Button>

          <Button
            @click="drawerRef?.close()"
            variant="ghost"
            size="lg"
            class="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import Drawer from '~/components/ui/Drawer.vue'
import Button from '~/components/ui/Button.vue'
import {ShoppingBag, ImageIcon} from 'lucide-vue-next'

type Emits = {
  (e: 'close'): void
}

defineEmits<Emits>()

const cartStore = useCartStore()
const {cartCount, isEmpty} = storeToRefs(cartStore)

const drawerRef = ref<InstanceType<typeof Drawer>>()

async function removeItem(cartItemId: string) {
  try {
    await cartStore.removeItem(cartItemId)
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

const goToCheckout = () => {
  drawerRef.value?.close()
  navigateTo('/checkout')
}

const open = () => {
  drawerRef.value?.open()
}

const close = () => {
  drawerRef.value?.close()
}

defineExpose({open, close})
</script>
