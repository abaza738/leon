<template>
  <div class="flex-1 flex flex-col">
    <TheNavbar />
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, session } = useUserSession()

if (!loggedIn.value || !session.value?.isAdmin) {
  navigateTo({ name: 'home' })
}
</script>
