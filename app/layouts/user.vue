<template>
  <div class="flex-1 flex flex-col">
    <TheNavbar />
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()

if (!loggedIn.value) {
  navigateTo({ name: 'login' })
}
</script>
