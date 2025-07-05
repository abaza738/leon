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
          class="-rotate-12"
        />
        <h2 class="text-lg font-bold">Leon's Restaurant</h2>
      </section>

      <section class="flex items-center justify-center gap-2"></section>

      <section class="flex items-center justify-end justify-self-end gap-2">
        <AuthState v-slot="{ user }">
          <template v-if="user">
            <UDropdownMenu
              :items="userMenuItems"
              :content="{ align: 'end' }"
            >
              <template #default>
                <UAvatar
                  :src="user.picture"
                  :text="user.given_name"
                  icon="solar:user-bold"
                />
              </template>
            </UDropdownMenu>
          </template>
        </AuthState>
      </section>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { clear, user } = useUserSession()

const userMenuItems: DropdownMenuItem[][] = [
  [{ color: 'info', label: user.value?.name, icon: 'solar:user-bold' }],
  [
    {
      color: 'error',
      label: 'Logout',
      icon: 'solar:logout-3-bold',
      onSelect: () => {
        clear()
        navigateTo({ name: 'auth' })
      },
    },
  ],
]
</script>
