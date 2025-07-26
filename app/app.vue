<template>
  <div class="container mx-auto max-w-7xl h-full">
    <!-- Offline Screen (client-side only) -->
    <ClientOnly>
      <OfflineScreen v-if="!isOnline" />
    </ClientOnly>

    <!-- Main App -->
    <div v-show="isOnline">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
const isOnline = useOnline()

useHead({bodyAttrs: {class: 'flex flex-col'}, title: "Leon's Restaurant"})
</script>
