<template>
  <div class="bg-white">
    <div
      class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-32"
    >
      <div class="lg:col-span-4">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>

        <div
          v-if="stats.totalReviews > 0"
          class="mt-3 flex items-center"
        >
          <div>
            <div class="flex items-center">
              <Star
                v-for="star in 5"
                :key="`review-filled-${star}`"
                :class="[
                  'size-5 shrink-0',
                  star <= Math.round(stats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                ]"
              />
            </div>
            <p class="sr-only">{{ stats.averageRating }} out of 5 stars</p>
          </div>
          <p class="ml-2 text-sm text-gray-900">
            {{ stats.averageRating }} based on {{ stats.totalReviews }} review{{
              stats.totalReviews !== 1 ? 's' : ''
            }}
          </p>
        </div>

        <div
          v-else
          class="mt-3"
        >
          <p class="text-sm text-gray-500">No reviews yet</p>
        </div>

        <div
          v-if="stats.totalReviews > 0"
          class="mt-6"
        >
          <h3 class="sr-only">Review data</h3>

          <dl class="space-y-3">
            <div
              v-for="rating in [5, 4, 3, 2, 1]"
              :key="rating"
              class="flex items-center text-sm"
            >
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-gray-900">
                  {{ rating }}<span class="sr-only"> star reviews</span>
                </p>
                <div
                  aria-hidden="true"
                  class="ml-1 flex flex-1 items-center"
                >
                  <Star class="size-5 shrink-0 text-yellow-400 fill-current" />

                  <div class="relative ml-3 flex-1">
                    <div class="h-3 rounded-full border border-gray-200 bg-gray-100"></div>
                    <div
                      :style="`width: ${stats.totalReviews ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                  </div>
                </div>
              </dt>
              <dd class="ml-3 w-10 text-right text-sm text-gray-900 tabular-nums">
                {{
                  stats.totalReviews
                    ? Math.round((stats.ratingDistribution[rating] / stats.totalReviews) * 100)
                    : 0
                }}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
        <h3 class="sr-only">Recent reviews</h3>

        <!-- Loading State -->
        <div
          v-if="reviewsLoading"
          class="space-y-8"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse"
          >
            <div class="flex items-center">
              <div class="size-12 bg-gray-200 rounded-full"></div>
              <div class="ml-4 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="flex space-x-1">
                  <div
                    v-for="j in 5"
                    :key="j"
                    class="size-4 bg-gray-200 rounded"
                  ></div>
                </div>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- No Reviews State -->
        <div
          v-else-if="!reviewsData?.items?.length"
          class="text-center py-12"
        >
          <div
            class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Star class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p class="text-gray-500">Be the first to share your thoughts about this product</p>
        </div>

        <!-- Reviews List -->
        <div
          v-else
          class="flow-root"
        >
          <div class="-my-12 divide-y divide-gray-200">
            <div
              v-for="review in reviewsData.items"
              :key="review.id"
              class="py-12"
            >
              <div class="flex items-center">
                <div
                  class="size-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"
                >
                  <img
                    v-if="review.expand?.customer?.avatar"
                    :src="
                      getFileUrl(review.expand.customer, review.expand.customer.avatar, '80x80')
                    "
                    :alt="`${review.expand?.customer?.name || 'User'} avatar`"
                    class="w-full h-full object-cover"
                  />
                  <User
                    v-else
                    class="w-6 h-6 text-gray-600"
                  />
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-bold text-gray-900">
                    {{ review.expand?.customer?.name || 'Anonymous' }}
                  </h4>
                  <div class="mt-1 flex items-center">
                    <Star
                      v-for="star in review.rating"
                      :key="`${review.id}-star-${star}`"
                      class="size-5 shrink-0 text-yellow-400 fill-current"
                    />
                    <Star
                      v-for="emptyStar in 5 - review.rating"
                      :key="`${review.id}-empty-${emptyStar}`"
                      class="size-5 shrink-0 text-gray-300"
                    />
                  </div>
                  <p class="sr-only">{{ review.rating }} out of 5 stars</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatRelativeTime(review.created) }}
                  </p>
                </div>
              </div>

              <div class="mt-4 space-y-6 text-base text-gray-600">
                <h5
                  v-if="review.title"
                  class="font-medium text-gray-900"
                >
                  {{ review.title }}
                </h5>
                <p
                  v-if="review.comment"
                  class="italic"
                >
                  {{ review.comment }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Star, User} from 'lucide-vue-next'
import {getFileUrl} from '~/utils/pocketbase'

const props = defineProps<{productId: string}>()

const {getProductReviews, calculateReviewStats} = useReviews()

const {
  data: reviewsData,
  pending: reviewsLoading,
  refresh: refreshReviews
} = await getProductReviews(props.productId)

const stats = computed(() => {
  if (!reviewsData.value?.items) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    }
  }
  return calculateReviewStats(reviewsData.value.items)
})

defineExpose({refreshReviews})
</script>
