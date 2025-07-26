<template>
  <nav
    class="flex items-center justify-between mt-10 bg-white px-4 py-3 sm:px-6"
    aria-label="Pagination"
  >
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ startItem }}</span>
        to
        <span class="font-medium">{{ endItem }}</span>
        of
        <span class="font-medium">{{ totalItems }}</span>
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      <Button
        @click="$emit('previous')"
        :disabled="!canGoPrevious"
        variant="secondary"
        size="md"
        class="relative inline-flex items-center"
      >
        Previous
      </Button>
      <Button
        @click="$emit('next')"
        :disabled="!canGoNext"
        variant="secondary"
        size="md"
        class="relative ml-3 inline-flex items-center"
      >
        Next
      </Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Button from './Button.vue'

type Props = {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
}

const props = defineProps<Props>()

defineEmits<{previous: []; next: []}>()

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.perPage + 1
})

const endItem = computed(() => {
  const calculated = props.currentPage * props.perPage
  return Math.min(calculated, props.totalItems)
})

const canGoPrevious = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)
</script>
