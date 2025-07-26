<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Header -->
      <div class="flex items-center justify-center gap-4 mb-6">
        <ChefHat
          :size="32"
          class="-rotate-12 text-amber-500"
        />
        <h1 class="font-bold text-2xl rounded-lg">Leon's Restaurant</h1>
      </div>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
        <div class="space-y-6">
          <!-- Google Auth Button -->
          <div>
            <Button
              @click="handleGoogleLogin"
              :disabled="isLoading"
              variant="secondary"
              size="lg"
              class="w-full"
            >
              <GoogleIcon />
              <span class="text-sm/6 font-semibold">Continue with Google</span>
            </Button>
          </div>

          <div
            v-if="error"
            class="p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <p class="text-sm text-red-700">{{
              (error as any)?.data?.message ||
              (error as any)?.message ||
              'Login failed. Please try again.'
            }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ChefHat} from 'lucide-vue-next'
import GoogleIcon from '~/components/icons/GoogleIcon.vue'
import Button from '~/components/ui/Button.vue'

definePageMeta({layout: 'public', name: 'signin', middleware: 'public'})

useHead({titleTemplate: (t) => `${t} | Sign In`})

const {loginWithGoogle} = useAuth()

// Using useAsyncData with manual execution
const {
  pending: isLoading,
  error,
  execute: handleGoogleLogin
} = await useAsyncData(
  'google-login',
  async () => {
    await loginWithGoogle()

    // Get user role and redirect accordingly
    const {isAdmin} = useAuth()
    if (isAdmin.value) {
      await navigateTo('/admin')
    } else {
      await navigateTo('/')
    }
  },
  {
    immediate: false // Don't execute automatically
  }
)
</script>
