<template>
  <div class="flex-1 flex flex-col items-center justify-center gap-4">
    <div class="flex items-center gap-4">
      <Icon name="solar:chef-hat-minimalistic-bold" size="2rem" class="-rotate-12" />
      <h1 class="font-bold text-2xl rounded-lg"> Leon's Restaurant </h1>
    </div>

    <div class="flex items-center gap-2">
      <UButton label="Continue with Google" icon="i-prime-google" variant="outline" color="neutral" size="xl"
        to="/api/auth/google" external />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
  name: 'auth'
})

useHead({
  titleTemplate: (t) => `${t} | Login`
})
</script>
