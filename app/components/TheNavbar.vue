<template>
  <nav class="flex items center w-full bg-white/20 backdrop-blur-md border-b-2 border-primary-800">
    <div class="container mx-auto grid grid-cols-3 place-items-center gap-4 px-4 py-2">
      <section class="flex items-center gap-2 justify-self-start">
        <NuxtLink class="inline-flex items-center gap-2" :to="{ name: 'home' }">
          <Icon :name="session?.isAdmin ? 'solar:shield-minimalistic-bold' : 'solar:chef-hat-minimalistic-bold'"
            class="-rotate-12 text-lg" :class="{ 'text-yellow-600': session?.isAdmin }" />
          <h2 class="text-lg font-bold">Leon's Restaurant</h2>
        </NuxtLink>
      </section>

      <section class="flex items-center justify-center gap-2"></section>

      <section class="flex items-center justify-end justify-self-end gap-2">
        <template v-if="user">
          <UDropdownMenu :items="userMenuItems" :content="{ align: 'end' }">
            <template #default>
              <UAvatar :src="user.picture" :text="user.given_name" class="cursor-pointer" icon="solar:user-bold" />
            </template>
          </UDropdownMenu>
        </template>
      </section>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { user, session } = useUserSession()

const userMenuItems = computed<DropdownMenuItem[][]>(() => {
  const adminItems: DropdownMenuItem[] = []

  if (session.value?.isAdmin) {
    adminItems.push({ label: 'Admin Panel', icon: 'solar:shield-minimalistic-bold', to: { name: 'admin' } })
  }

  return [
    [
      { label: user.value?.name, icon: 'solar:user-bold' },
      ...adminItems
    ],
    [
      {
        color: 'error',
        label: 'Logout',
        icon: 'solar:logout-3-bold',
        to: { name: 'logout' }
      },
    ],
  ]
})
</script>
