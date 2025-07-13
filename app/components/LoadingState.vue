<template>
  <div class="flex flex-col items-center justify-center py-16">
    <UIcon
      name="i-lucide-loader-2"
      class="w-8 h-8 animate-spin text-green-500 mb-4"
    />
    <p class="text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

const { message = 'Loading...' } = defineProps<Props>()
</script>
