<template>
  <nav
    class="flex items center w-full bg-white/20 backdrop-blur-md border-b-2 border-primary-800"
  >
    <div
      class="container mx-auto grid grid-cols-3 place-items-center gap-4 px-4 py-2"
    >
      <section class="flex items-center gap-2 justify-self-start">
        <Icon
          name="solar:chef-hat-minimalistic-bold"
          class="-rotate-12 text-lg"
        />
        <h2 class="text-lg font-bold">Leon's Restaurant</h2>
      </section>

      <section class="flex items-center justify-center gap-2"></section>

      <section class="flex items-center justify-end justify-self-end gap-2">
        <template v-if="user">
          <UDropdownMenu
            :items="userMenuItems"
            :content="{ align: 'end' }"
          >
            <template #default>
              <UAvatar
                :src="avatarUrl || undefined"
                :text="user.name || user.email"
                icon="solar:user-bold"
              />
            </template>
          </UDropdownMenu>
        </template>
      </section>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuth } from '~~/composables/useAuth'

const { logout, user, avatarUrl } = useAuth()

const userMenuItems = computed<DropdownMenuItem[]>(() => {
  const adminItems: DropdownMenuItem[] = []

  // TODO: Add admin role checking when implemented in PocketBase
  // if (user.value?.isAdmin) {
  //   adminItems.push({ label: 'Admin Panel', icon: 'solar:shield-minimalistic-bold', to: { name: 'admin' } })
  // }

  return [
    [
      { label: user.value?.name || user.value?.email, icon: 'solar:user-bold' },
      ...adminItems,
    ],
    [
      {
        color: 'error',
        label: 'Logout',
        icon: 'solar:logout-3-bold',
        onSelect: () => {
          logout()
          navigateTo('/auth')
        },
      },
    ],
  ]
})
</script>
