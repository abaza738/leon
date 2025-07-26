<template>
  <div class="bg-white sticky top-0 z-10">
    <header class="relative bg-white">
      <nav
        aria-label="Top"
        class="mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        <div class="border-b border-gray-200 px-4 pb-14 sm:px-0 sm:pb-0">
          <div class="flex h-16 items-center justify-between">
            <!-- Logo -->
            <div class="flex flex-1">
              <NuxtLink
                to="/"
                class="flex items-center gap-3 group"
                aria-label="Leon's Restaurant - Go to home page"
              >
                <ChefHat
                  class="w-6 h-6 text-primary transition-transform duration-200 group-hover:rotate-12 text-2xl text-primary inline-block -rotate-12"
                />

                <div class="flex-col">
                  <span class="text-xl font-bold text-gray-900">Leon's Restaurant</span>
                  <span class="text-xs text-gray-500 hidden sm:block">Authentic flavors await</span>
                </div>
              </NuxtLink>
            </div>

            <!-- Navigation Menu -->
            <div class="absolute inset-x-0 bottom-0 sm:static sm:flex-1 sm:self-stretch">
              <div
                class="flex h-14 space-x-8 overflow-x-auto border-t px-4 pb-px sm:h-full sm:justify-center sm:overflow-visible sm:border-t-0 sm:pb-0"
              >
                <!-- Admin Navigation -->
                <template v-if="isAdmin">
                  <NuxtLink
                    to="/admin"
                    class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
                    :class="{
                      'border-indigo-600 text-indigo-600': $route.path === '/admin'
                    }"
                  >
                    Orders
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/users"
                    class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
                    :class="{
                      'border-indigo-600 text-indigo-600': $route.path === '/admin/users'
                    }"
                  >
                    Users
                  </NuxtLink>
                  <NuxtLink
                    to="/"
                    class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
                    :class="{
                      'border-indigo-600 text-indigo-600': $route.path === '/'
                    }"
                  >
                    Menu
                  </NuxtLink>
                </template>

                <!-- Regular User Navigation -->
                <template v-else>
                  <NuxtLink
                    to="/"
                    class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
                    :class="{
                      'border-indigo-600 text-indigo-600': $route.path === '/'
                    }"
                  >
                    Menu
                  </NuxtLink>

                  <template v-if="user">
                    <NuxtLink
                      to="/orders"
                      class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
                      :class="{
                        'border-indigo-600 text-indigo-600': $route.path.startsWith('/orders')
                      }"
                    >
                      My Orders
                    </NuxtLink>
                  </template>
                </template>
              </div>
            </div>

            <div class="flex flex-1 items-center justify-end">
              <template v-if="user">
                <!-- Cart (only for regular users) -->
                <div
                  v-if="!isAdmin"
                  class="ml-4 flow-root lg:ml-8"
                >
                  <CartDrawer ref="cartDrawerRef" />
                </div>

                <!-- User Menu -->
                <div class="ml-4">
                  <DropdownMenu
                    align="end"
                    side="bottom"
                    :side-offset="8"
                    :groups="userMenuGroups"
                    @item-click="handleUserMenuAction"
                  >
                    <template #trigger>
                      <button
                        class="flex items-center p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                        aria-label="User menu"
                      >
                        <div
                          class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden"
                        >
                          <img
                            v-if="user?.avatar && getFileUrl(user, user.avatar)"
                            :src="getFileUrl(user, user.avatar)"
                            :alt="user?.name || 'User avatar'"
                            class="w-full h-full object-cover"
                          />
                          <User
                            v-else
                            class="w-5 h-5 text-gray-600"
                          />
                        </div>
                      </button>
                    </template>
                  </DropdownMenu>
                </div>
              </template>

              <template v-else>
                <div class="ml-4">
                  <Button
                    @click="navigateTo('/auth')"
                    variant="primary"
                    size="md"
                  >
                    Sign In
                  </Button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import DropdownMenu, {type MenuGroup} from '~/components/ui/DropdownMenu.vue'
import CartDrawer from '~/components/CartDrawer.vue'
import {ChefHat, LogOutIcon, UserIcon, ShoppingBagIcon, SettingsIcon, User} from 'lucide-vue-next'

const {logout, user, isAdmin} = useAuth()
const cartStore = useCartStore()
const {cartCount, cartItems} = storeToRefs(cartStore)

const cartDrawerRef = ref<InstanceType<typeof CartDrawer>>()

// Watch for items being added to cart and auto-open drawer
watch(cartCount, (newCount, oldCount) => {
  if (newCount > oldCount && !isAdmin.value && user.value) {
    useTimeoutFn(() => {
      cartDrawerRef.value?.open()
    }, 100)
  }
})

// Create user menu groups based on user role
const userMenuGroups = computed<MenuGroup[]>(() => {
  const groups: MenuGroup[] = [
    {
      items: [
        {
          id: 'user-profile-link',
          label: user.value?.name || user.value?.email || 'User',
          icon: UserIcon,
          href: '/profile'
        }
      ]
    }
  ]

  // Add role-specific navigation
  if (isAdmin.value) {
    groups.push({
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: SettingsIcon,
          href: '/admin'
        }
      ]
    })
  } else {
    groups.push({
      items: [
        {
          id: 'orders',
          label: 'My Orders',
          icon: ShoppingBagIcon,
          href: '/orders'
        }
      ]
    })
  }

  // Add logout action
  groups.push({
    items: [{id: 'logout', label: 'Logout', icon: LogOutIcon, action: 'logout'}]
  })

  return groups
})

// Handle user menu actions
const handleUserMenuAction = async (item: any) => {
  if (item.action === 'logout') {
    await handleLogout()
  } else if (item.href) {
    await navigateTo(item.href)
  }
}

// Handle logout
const handleLogout = async () => {
  try {
    logout()
    await navigateTo('/auth')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
