<template>
  <Dialog
    :open="isOpen"
    @update:open="$emit('update:open', $event ?? false)"
    :title="`Write a Review for ${productName}`"
    :description="`Share your experience with ${productName} to help other customers`"
    max-width="md"
  >
    <div class="space-y-6">
      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"> Rating * </label>
        <div
          class="flex items-center space-x-1"
          @mouseleave="hoverRating = 0"
        >
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="form.rating = star"
            @mouseenter="hoverRating = star"
            class="transition-colors duration-150"
          >
            <StarIcon
              :class="[
                'h-6 w-6',
                star <= (hoverRating || form.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              ]"
            />
          </button>
        </div>
        <p
          v-if="errors.rating"
          class="text-red-500 text-sm mt-1"
        >
          {{ errors.rating }}
        </p>
      </div>

      <!-- Title -->
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Review Title
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Summarize your experience"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <!-- Comment -->
      <div>
        <label
          for="comment"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          v-model="form.comment"
          rows="4"
          placeholder="Tell others about your experience with this product..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        ></textarea>
      </div>
    </div>

    <template #footer>
      <Button
        variant="primary"
        @click="submitReview"
        :disabled="!form.rating || submitting"
        :loading="submitting"
        class="w-full sm:w-auto sm:ml-3"
      >
        {{ existingReview ? 'Update Review' : 'Submit Review' }}
      </Button>
      <Button
        variant="ghost"
        @click="$emit('update:open', false)"
        :disabled="submitting"
        class="mt-3 w-full sm:mt-0 sm:w-auto"
      >
        Cancel
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {StarIcon} from 'lucide-vue-next'
import Dialog from '~/components/ui/Dialog.vue'
import Button from '~/components/ui/Button.vue'
import type {Review} from '~/types/restaurant'

type Props = {
  isOpen: boolean
  orderId: string
  productId: string
  productName: string
  existingReview?: Review | null
}

type Emits = {
  (e: 'update:open', value: boolean): void
  (e: 'review-submitted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {createReview, getExistingReview} = useReviews()

const {data: existingReview} = getExistingReview(props.orderId, props.productId)

const form = reactive({rating: 0, title: '', comment: ''})

const hoverRating = ref(0)

// Form validation
const errors = reactive({rating: ''})

// Loading state
const submitting = ref(false)

// Validate form
function validateForm() {
  errors.rating = ''

  if (!form.rating) {
    errors.rating = 'Please select a rating'
    return false
  }

  return true
}

// Submit review
async function submitReview() {
  if (!validateForm()) return

  submitting.value = true

  try {
    // Create new review
    await createReview({
      order: props.orderId,
      product: props.productId,
      rating: form.rating,
      title: form.title || undefined,
      comment: form.comment || undefined
    })

    emit('review-submitted')
    emit('update:open', false)
  } catch (error) {
    console.error('Error submitting review:', error)
  } finally {
    submitting.value = false
  }
}
</script>
