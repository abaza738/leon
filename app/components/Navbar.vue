<template>
  <nav
    class="sticky top-0 z-50 w-full bg-default/80 backdrop-blur-lg border-b border-default"
    role="navigation"
    aria-label="Main navigation"
  >
    <div
      class="container mx-auto flex items-center justify-between px-4 py-3 lg:px-6"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
        aria-label="Leon's Restaurant - Go to home page"
      >
        <UIcon
          name="i-solar-chef-hat-minimalistic-bold"
          class="text-2xl text-primary -rotate-12 transition-transform duration-200 hover:rotate-0"
        />
        <div class="flex flex-col">
          <h1 class="text-xl font-bold text-highlighted">
            Leon's Restaurant
          </h1>
          <span class="text-xs text-muted hidden sm:block">
            Authentic flavors await
          </span>
        </div>
      </NuxtLink>

      <!-- User Actions Section -->
      <div class="flex items-center gap-3">
        <template v-if="user">
          <!-- Cart Button -->
          <UButton
            to="/checkout"
            color="success"
            variant="solid"
            size="md"
            class="relative"
            :aria-label="`View cart with ${cartCount} items`"
          >
            <UIcon
              name="i-lucide-shopping-cart"
              class="mr-2"
            />
            <span class="hidden sm:inline">Cart</span>
            <UBadge
              v-if="cartCount > 0"
              :label="cartCount.toString()"
              color="warning"
              variant="solid"
              size="xs"
              class="absolute -top-1 -right-1"
            />
          </UButton>

          <!-- User Menu -->
          <UDropdownMenu
            :items="userMenuItems"
            :content="{ align: 'end' }"
            size="lg"
          >
            <UButton
              color="neutral"
              variant="outline"
              class="transition-all duration-200 hover:bg-elevated"
              aria-label="User menu"
            >
              <UAvatar
                :src="avatarUrl || undefined"
                :alt="user.name || user.email"
                size="xs"
              />
              <UIcon
                name="i-lucide-chevron-down"
                class="ml-1 text-toned"
              />
            </UButton>
          </UDropdownMenu>
        </template>

        <template v-else>
          <UButton
            to="/auth"
            color="success"
            variant="solid"
            size="sm"
            aria-label="Sign in to your account"
          >
            Sign In
          </UButton>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { storeToRefs } from 'pinia'

const { logout, user, avatarUrl } = useAuth()
const cartStore = useCartStore()
const { cartCount, cartItems } = storeToRefs(cartStore)

const userMenuItems = computed(() => {
  const adminItems: any[] = []

  // TODO: Add admin role checking when implemented in PocketBase
  // if (user.value?.isAdmin) {
  //   adminItems.push({
  //     label: 'Admin Panel',
  //     icon: 'i-solar-shield-minimalistic-bold',
  //     click: () => navigateTo('/admin')
  //   })
  // }

  return [
    [
      {
        label: user.value?.name || user.value?.email || 'User',
        icon: 'i-solar-user-bold',
        disabled: true,
      },
      { label: 'My Orders', icon: 'i-lucide-receipt', to: '/orders' },
      ...adminItems,
    ],
    [
      {
        label: 'Logout',
        icon: 'i-solar-logout-3-bold',
        onSelect: async () => {
          try {
            logout()
            await navigateTo('/auth')
          } catch (error) {
            console.error('Logout error:', error)
          }
        },
      },
    ],
  ]
})
</script>
