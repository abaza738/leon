<template>
  <UApp>
    <div class="container mx-auto max-w-7xl">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
useHead({ bodyAttrs: { class: 'flex flex-col' }, title: "Leon's Restaurant" })
</script>
