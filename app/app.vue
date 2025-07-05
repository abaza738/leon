<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'flex flex-col'
  },
  title: 'Leon\'s Restaurant'
})
</script>
