<template>
  <div class="flex-1 flex flex-col items-center justify-center gap-8">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Icon
        name="solar:chef-hat-minimalistic-bold"
        size="2rem"
        class="-rotate-12"
      />
      <h1 class="font-bold text-2xl rounded-lg">Leon's Restaurant</h1>
    </div>

    <!-- Authenticated State -->
    <div
      v-if="isAuthenticated && user"
      class="flex flex-col items-center gap-6"
    >
      <div class="bg-white shadow rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="user.name || user.email"
              class="h-12 w-12 rounded-full"
            />
            <div
              v-else
              class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center"
            >
              <span class="text-gray-600 font-medium">
                {{ (user?.name || user?.email || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user?.name || 'User' }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ user?.email }}
            </p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="text-sm text-green-600"
            >✓ Authenticated with PocketBase</div
          >
        </div>
      </div>

      <div class="flex gap-4">
        <UButton
          label="Go to Dashboard"
          icon="i-lucide-home"
          variant="solid"
          color="primary"
          size="lg"
          to="/"
        />
        <UButton
          label="Sign Out"
          icon="i-lucide-log-out"
          variant="outline"
          color="error"
          size="lg"
          @click="handleLogout"
          :loading="isLoading"
        />
      </div>
    </div>

    <!-- Unauthenticated State -->
    <div
      v-else
      class="flex flex-col items-center gap-6"
    >
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
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'public', name: 'auth', middleware: 'public' })
useHead({ titleTemplate: (t) => `${t} | Login` })

const { isAuthenticated, user, avatarUrl, loginWithGoogle, logout } = useAuth()

const isLoading = ref(false)
const error = ref('')

const handleGoogleLogin = async () => {
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

const handleLogout = async () => {
  isLoading.value = true
  try {
    logout()
  } finally {
    isLoading.value = false
  }
}
</script>
