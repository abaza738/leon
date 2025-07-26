<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="relative">
      <div
        class="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"
      ></div>
    </div>

    <p class="mt-4 text-sm text-gray-600">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
type Props = {message?: string}

const {message = 'Loading...'} = defineProps<Props>()
</script>
