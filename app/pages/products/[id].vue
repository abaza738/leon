<template>
  <!-- Loading state -->
  <div
    v-if="loading"
    class="bg-white"
  >
    <div
      class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
    >
      <div class="lg:max-w-lg lg:self-end">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-20 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
      <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <div class="aspect-square w-full rounded-lg bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  </div>

  <!-- Error state -->
  <div
    v-else-if="productError || (!loading && !product)"
    class="bg-white"
  >
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
      <p class="text-gray-500 mb-8"
        >The product you're looking for doesn't exist or has been removed.</p
      >
      <Button
        @click="navigateTo('/')"
        variant="primary"
        size="lg"
      >
        Back to Menu
      </Button>
    </div>
  </div>

  <!-- Product content -->
  <div
    v-else-if="product"
    class="bg-white"
  >
    <div
      class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
    >
      <!-- Product details -->
      <div class="lg:max-w-lg lg:self-end">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            class="flex items-center space-x-2"
          >
            <li>
              <div class="flex items-center text-sm">
                <NuxtLink
                  to="/"
                  class="font-medium text-gray-500 hover:text-gray-900"
                  >Menu</NuxtLink
                >
                <ChevronRight class="ml-2 size-5 shrink-0 text-gray-300" />
              </div>
            </li>
            <li>
              <div class="flex items-center text-sm">
                <span class="font-medium text-gray-500">{{
                  product?.expand?.category?.name || 'Food'
                }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div class="mt-4">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {{ product?.name || 'Loading...' }}
          </h1>
        </div>

        <section
          aria-labelledby="information-heading"
          class="mt-4"
        >
          <h2
            id="information-heading"
            class="sr-only"
            >Product information</h2
          >

          <div class="flex items-center">
            <div>
              <p class="text-lg text-gray-900 sm:text-xl">
                <span class="text-gray-500">Base price:</span>
                {{ formatPrice(product.base_price) }}
              </p>
              <p
                v-if="totalPrice > (product?.base_price || 0) * quantity"
                class="text-sm text-indigo-600 mt-1"
              >
                <span class="font-medium">Total with customizations:</span>
                {{ formatPrice(totalPrice / quantity) }}
              </p>
            </div>

            <div class="ml-4 border-l border-gray-300 pl-4">
              <h2 class="sr-only">Reviews</h2>
              <div
                v-if="reviewStats.totalReviews > 0"
                class="flex items-center"
              >
                <div>
                  <div class="flex items-center">
                    <Star
                      v-for="star in 5"
                      :key="`filled-${star}`"
                      :class="[
                        'size-5 shrink-0',
                        star <= Math.round(reviewStats.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      ]"
                    />
                  </div>
                  <p class="sr-only">{{ reviewStats.averageRating }} out of 5 stars</p>
                </div>
                <p class="ml-2 text-sm text-gray-500">
                  {{ reviewStats.averageRating }} out of 5 stars ({{
                    reviewStats.totalReviews
                  }}
                  review{{ reviewStats.totalReviews !== 1 ? 's' : '' }})
                </p>
              </div>
              <div
                v-else
                class="flex items-center"
              >
                <div class="flex items-center">
                  <Star
                    v-for="star in 5"
                    :key="`empty-${star}`"
                    class="size-5 shrink-0 text-gray-300"
                  />
                </div>
                <p class="ml-2 text-sm text-gray-500">No reviews yet</p>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-6">
            <p class="text-base text-gray-500">
              {{
                product?.description ||
                'Delicious and freshly prepared with the finest ingredients.'
              }}
            </p>
          </div>

          <div class="mt-6 flex items-center"> </div>
        </section>
      </div>

      <!-- Product image -->
      <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
        <img
          v-if="product?.image"
          :src="getFileUrl(product, product.image)"
          :alt="product.name"
          class="aspect-square w-full rounded-lg object-cover"
        />
        <div
          v-else
          class="aspect-square w-full rounded-lg bg-gray-200 flex items-center justify-center"
        >
          <ImageIcon class="w-16 h-16 text-gray-400" />
        </div>
      </div>

      <!-- Product form -->
      <div class="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
        <section aria-labelledby="options-heading">
          <h2
            id="options-heading"
            class="sr-only"
            >Product options</h2
          >

          <form @submit.prevent="handleAddToCart">
            <!-- Addon Selection -->
            <div
              v-if="addonGroups.length > 0"
              class="mb-6"
            >
              <fieldset>
                <legend class="block text-sm font-medium text-gray-700 mb-3">
                  Customize Your Order
                </legend>

                <!-- Addon Groups -->
                <div
                  v-for="group in addonGroups"
                  :key="group.id"
                  class="mb-8"
                >
                  <!-- Radio Group -->
                  <fieldset
                    v-if="group.type === 'radio'"
                    class="border-b pb-4 border-gray-200"
                  >
                    <legend class="text-sm/6 font-semibold text-gray-900">
                      {{ group.name }}
                      <span
                        v-if="group.is_required"
                        class="text-red-500"
                        >*</span
                      >
                    </legend>
                    <p
                      v-if="group.description"
                      class="mt-1 text-sm/6 text-gray-600"
                      >{{ group.description }}</p
                    >
                    <div class="mt-2">
                      <label
                        v-for="addon in group.expand?.addons_via_addon_group?.filter(
                          (a) => a.is_available
                        )"
                        :key="addon.id"
                        :for="`addon-${addon.id}`"
                        class="relative flex items-center py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2"
                      >
                        <div class="mr-3 flex h-6 items-center">
                          <input
                            :id="`addon-${addon.id}`"
                            :aria-describedby="`addon-${addon.id}-description`"
                            :name="`group-${group.id}`"
                            type="radio"
                            :checked="isAddonSelected(group.id, addon.id)"
                            @change="toggleAddon(group.id, addon.id, group.type)"
                            class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                          />
                        </div>
                        <div class="min-w-0 flex-1 text-sm/6">
                          <div class="flex items-center justify-between">
                            <div class="font-medium text-gray-900">
                              {{ addon.name }}
                              <span
                                v-if="addon.is_default"
                                class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                Default
                              </span>
                            </div>
                            <div class="ml-3">
                              <span
                                v-if="addon.price_modifier > 0"
                                class="font-medium text-indigo-600 text-sm"
                              >
                                +{{ formatPrice(addon.price_modifier) }}
                              </span>
                              <span
                                v-else-if="addon.price_modifier < 0"
                                class="font-medium text-red-600 text-sm"
                              >
                                {{ formatPrice(addon.price_modifier) }}
                              </span>
                              <span
                                v-else
                                class="font-medium text-green-600 text-sm"
                              >
                                Free
                              </span>
                            </div>
                          </div>
                          <p
                            v-if="addon.description"
                            :id="`addon-${addon.id}-description`"
                            class="text-gray-500 text-sm mt-1"
                          >
                            {{ addon.description }}
                          </p>
                        </div>
                      </label>
                    </div>
                  </fieldset>

                  <!-- Checkbox Group -->
                  <fieldset
                    v-else
                    class=""
                  >
                    <legend class="sr-only">{{ group.name }}</legend>
                    <div class="pt- pb-1">
                      <h4 class="text-sm/6 font-semibold text-gray-900">
                        {{ group.name }}
                        <span
                          v-if="group.is_required"
                          class="text-red-500"
                          >*</span
                        >
                      </h4>
                      <p
                        v-if="group.description"
                        class="mt-1 text-sm/6 text-gray-600"
                        >{{ group.description }}</p
                      >
                    </div>
                    <div>
                      <label
                        v-for="addon in group.expand?.addons_via_addon_group?.filter(
                          (a) => a.is_available
                        )"
                        :key="addon.id"
                        :for="`addon-${addon.id}`"
                        class="relative flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 -mx-2"
                      >
                        <div class="flex h-6 shrink-0 items-center">
                          <div class="group grid size-4 grid-cols-1">
                            <input
                              :id="`addon-${addon.id}`"
                              :aria-describedby="`addon-${addon.id}-description`"
                              :name="`addon-${addon.id}`"
                              type="checkbox"
                              :checked="isAddonSelected(group.id, addon.id)"
                              @change="toggleAddon(group.id, addon.id, group.type)"
                              class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            />
                            <Check
                              class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 opacity-0 group-has-checked:opacity-100"
                            />
                            <Minus
                              class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 opacity-0 group-has-indeterminate:opacity-100"
                            />
                          </div>
                        </div>
                        <div class="min-w-0 flex-1 text-sm/6">
                          <div class="flex items-center justify-between">
                            <div class="font-medium text-gray-900">
                              {{ addon.name }}
                              <span
                                v-if="addon.is_default"
                                class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                Default
                              </span>
                            </div>
                            <div class="ml-3">
                              <span
                                v-if="addon.price_modifier > 0"
                                class="font-medium text-indigo-600 text-sm"
                              >
                                +{{ formatPrice(addon.price_modifier) }}
                              </span>
                              <span
                                v-else-if="addon.price_modifier < 0"
                                class="font-medium text-red-600 text-sm"
                              >
                                {{ formatPrice(addon.price_modifier) }}
                              </span>
                              <span
                                v-else
                                class="font-medium text-green-600 text-sm"
                              >
                                Free
                              </span>
                            </div>
                          </div>
                          <p
                            v-if="addon.description"
                            :id="`addon-${addon.id}-description`"
                            class="text-gray-500 text-sm mt-1"
                          >
                            {{ addon.description }}
                          </p>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </fieldset>
            </div>

            <!-- Special Instructions -->
            <div class="mb-6">
              <label
                for="special-instructions"
                class="block text-sm font-medium text-gray-900 mb-2"
              >
                Special Instructions
              </label>
              <textarea
                id="special-instructions"
                v-model="specialInstructions"
                rows="3"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Any special requests or dietary preferences..."
              />
            </div>

            <!-- Quantity and Add to Cart -->
            <div class="mt-6 space-y-4">
              <div class="flex items-center gap-3">
                <label class="text-sm font-medium text-gray-700">Quantity:</label>
                <Button
                  type="button"
                  @click="decrementQuantity"
                  variant="secondary"
                  size="xs"
                  class="w-8 h-8 rounded-full p-0"
                >
                  <Minus class="w-4 h-4" />
                </Button>
                <span class="min-w-[2rem] text-center text-sm font-medium">{{ quantity }}</span>
                <Button
                  type="button"
                  @click="incrementQuantity"
                  variant="primary"
                  size="xs"
                  class="w-8 h-8 rounded-full p-0"
                >
                  <Plus class="w-4 h-4" />
                </Button>
              </div>

              <Button
                type="submit"
                :disabled="!product?.is_available || isAddingToCart"
                variant="primary"
                size="lg"
                class="w-full"
              >
                Add to cart
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>

  <!-- Reviews Section -->
  <ProductReviews :product-id="productId" />
  <!-- End of Product content conditional -->
</template>

<script setup lang="ts">
import {useProducts} from '~/composables/useProducts'
import Button from '~/components/ui/Button.vue'
import ProductReviews from '~/components/ProductReviews.vue'
import {calculateProductTotal} from '~/utils/calculations'
import {ChevronRight, Star, ImageIcon, Minus, Plus, Check} from 'lucide-vue-next'
import type {ProductWithAddons, AddonGroupWithAddons, SelectedAddon} from '~/types/restaurant'

definePageMeta({layout: 'user', middleware: 'authenticated'})

const route = useRoute()
const {getProductWithAddons} = useProducts()
const {addToCart} = useCartStore()
const {error: showError} = useToast()
const {getProductReviews, calculateReviewStats} = useReviews()

// Get product data
const {
  data: product,
  pending: loading,
  error: productError
} = await useLazyAsyncData(`product-${route.params.id}`, () =>
  getProductWithAddons(route.params.id as string)
)

// Get product reviews for the rating display
const productId = computed(() => route.params.id as string)
const {data: reviewsData} = await getProductReviews(productId.value)

// Calculate review statistics for top display
const reviewStats = computed(() => {
  if (!reviewsData.value?.items) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    }
  }
  return calculateReviewStats(reviewsData.value.items)
})

// Simple reactive state
const quantity = ref(1)
const selectedAddons = ref<Record<string, string[]>>({})
const specialInstructions = ref('')
const isAddingToCart = ref(false)

// Computed
const addonGroups = computed(
  () =>
    (product.value?.expand?.addon_groups_via_product?.filter((g) => g.is_active) ||
      []) as AddonGroupWithAddons[]
)
const totalPrice = computed(() => {
  if (!product.value) return 0

  // Get selected addons for calculation
  const addons = Object.values(selectedAddons.value)
    .flat()
    .map((addonId) => {
      const addon = addonGroups.value
        .flatMap((g) => g.expand?.addons_via_addon_group || [])
        .find((a) => a.id === addonId)
      return addon ? {price_modifier: addon.price_modifier} : {price_modifier: 0}
    })
    .filter((addon) => addon.price_modifier !== undefined)

  return calculateProductTotal(product.value.base_price, quantity.value, addons)
})
// Format add-ons for display
const selectedAddonsForDisplay = computed(() => {
  const result: SelectedAddon[] = []

  Object.entries(selectedAddons.value).forEach(([groupId, addonIds]) => {
    addonIds.forEach((addonId) => {
      const group = addonGroups.value.find((g) => g.id === groupId)
      const addon = group?.expand?.addons_via_addon_group?.find((a) => a.id === addonId)

      if (addon) {
        result.push({
          addon_id: addon.id,
          name: addon.name,
          price: addon.price_modifier,
          addon_group: groupId
        })
      }
    })
  })

  return result
})

// Format add-ons for cart in the format the cart store expects
const selectedAddonsForCart = computed(() => {
  const result: Record<string, Array<{id: string; name: string; price: number}>> = {}

  Object.entries(selectedAddons.value).forEach(([groupId, addonIds]) => {
    result[groupId] = []

    addonIds.forEach((addonId) => {
      const group = addonGroups.value.find((g) => g.id === groupId)
      const addon = group?.expand?.addons_via_addon_group?.find((a) => a.id === addonId)

      if (addon) {
        result[groupId].push({
          id: addon.id,
          name: addon.name,
          price: addon.price_modifier
        })
      }
    })
  })

  return result
})

// Functions
const incrementQuantity = () => quantity.value++
const decrementQuantity = () => quantity.value > 1 && quantity.value--
const isAddonSelected = (groupId: string, addonId: string) =>
  selectedAddons.value[groupId]?.includes(addonId)
const toggleAddon = (groupId: string, addonId: string, groupType: 'radio' | 'checkbox') => {
  if (!selectedAddons.value[groupId]) selectedAddons.value[groupId] = []
  if (groupType === 'radio') selectedAddons.value[groupId] = [addonId]
  else {
    const index = selectedAddons.value[groupId].indexOf(addonId)
    index > -1
      ? selectedAddons.value[groupId].splice(index, 1)
      : selectedAddons.value[groupId].push(addonId)
  }
}

// Initialize defaults when product loads
watchEffect(() => {
  if (!product.value) return
  selectedAddons.value = {}
  addonGroups.value.forEach((group) => {
    const defaults =
      group.expand?.addons_via_addon_group?.filter((a) => a.is_default && a.is_available) || []
    if (defaults.length) {
      selectedAddons.value[group.id] = defaults.map((a) => a.id)
    }
  })
})

// Add to cart handler
const handleAddToCart = async () => {
  if (!product.value) return

  isAddingToCart.value = true
  try {
    // Add special instructions to the selectedAddonsForCart if provided
    const cartAddons = selectedAddonsForCart.value

    // Call addToCart with the correct parameters
    await addToCart(product.value, quantity.value, cartAddons)

    // Reset form to defaults
    selectedAddons.value = {}
    addonGroups.value.forEach((group) => {
      const defaults =
        group.expand?.addons_via_addon_group?.filter((a) => a.is_default && a.is_available) || []
      if (defaults.length) {
        selectedAddons.value[group.id] = defaults.map((a) => a.id)
      }
    })
    specialInstructions.value = ''
    quantity.value = 1
  } catch (error) {
    console.error('Failed to add to cart:', error)
    showError('Failed to add item to cart. Please try again.', 'Add to Cart Failed')
  } finally {
    isAddingToCart.value = false
  }
}
</script>
