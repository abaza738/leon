<template>
  <div
    class="container mx-auto border-l border-r border-primary-800 flex-1 flex flex-col"
  >
    <div
      v-if="user"
      class="m-auto flex flex-col items-center justify-center gap-4"
    >
      <h1 class="text-2xl font-bold">Welcome {{ user.given_name }}!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~~/composables/useAuth'

definePageMeta({ layout: 'user', name: 'home', middleware: 'authenticated' })

useHead({ titleTemplate: (t) => `${t} | Home` })

const { user } = useAuth()
</script>
