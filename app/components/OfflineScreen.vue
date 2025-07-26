<template>
  <div class="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div class="text-center">
      <div class="text-6xl mb-4">📡</div>
      <h1 class="text-2xl font-bold mb-2">You're Offline</h1>
      <p class="text-gray-600 mb-4">Check your connection and try again</p>
      <Button @click="retry">Try Again</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
function retry() {
  window.location.reload()
}
</script>
