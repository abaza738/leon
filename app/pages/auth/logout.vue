<template>
  <div class="flex-1 flex flex-col items-center justify-center gap-4">
    <div class="flex items-center gap-4">
      <Icon name="solar:chef-hat-minimalistic-bold" size="2rem" class="-rotate-12" />
      <h1 class="font-bold text-2xl rounded-lg"> Leon's Restaurant </h1>
    </div>

    <div class="flex items-center gap-2">
      <Icon name="solar:refresh-bold" class="animate-spin" />
      <p>Logging Out...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public', name: 'logout' })

useHead({ titleTemplate: (t) => `${t} | Logging out...` })

const { clear } = useUserSession()

// For dramatic effect
onMounted(() => setTimeout(() => {
  clear()
  navigateTo({ name: 'login' })
}, 1e3))
</script>
