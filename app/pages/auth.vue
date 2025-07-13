<template>
  <div class="h-screen gap-8 flex justify-center items-center">
    <div>
      <!-- Header -->
      <div class="flex items-center justify-center gap-4">
        <Icon
          name="solar:chef-hat-minimalistic-bold"
          size="2rem"
          class="-rotate-12"
        />
        <h1 class="font-bold text-2xl rounded-lg">Leon's Restaurant</h1>
      </div>

      <!-- Unauthenticated State -->
      <div class="flex flex-col items-center gap-6">
        <div class="text-center max-w-md">
          <p class="text-gray-600 mb-6">
            Sign in with your Google account to access Leon's Restaurant.
          </p>

          <div
            v-if="error"
            class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <UButton
            label="Continue with Google"
            icon="i-prime-google"
            variant="outline"
            color="neutral"
            size="xl"
            @click="handleGoogleLogin"
            :loading="isLoading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public', name: 'auth', middleware: 'public' })

useHead({ titleTemplate: (t) => `${t} | Login` })

const { loginWithGoogle } = useAuth()

const isLoading = ref(false)
const error = ref('')

async function handleGoogleLogin() {
  isLoading.value = true
  error.value = ''

  try {
    await loginWithGoogle()
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
