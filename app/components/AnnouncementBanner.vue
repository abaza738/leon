<template>
  <div
    v-for="announcement in visibleAnnouncements"
    :key="announcement.id"
    class="flex items-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
  >
    <p class="text-sm/6 text-white">
      <strong class="font-semibold">{{ announcement.title }}</strong>
    </p>
    <div class="flex flex-1 justify-end">
      <button
        type="button"
        @click="dismissAnnouncement(announcement.id)"
        class="-m-3 p-3 focus-visible:outline-offset-[-4px] cursor-pointer"
        :aria-label="`Dismiss announcement: ${announcement.title}`"
      >
        <span class="sr-only">Dismiss</span>
        <X class="size-5 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {X} from 'lucide-vue-next'

const {announcements} = useAnnouncements()

// Dismissed announcements stored in cookies
const dismissedAnnouncements = useCookie<string[]>('dismissedAnnouncements', {
  default: () => []
})

const visibleAnnouncements = computed(() => {
  if (!announcements.value) return []
  return announcements.value.filter(
    (announcement) => !dismissedAnnouncements.value.includes(announcement.id)
  )
})

function dismissAnnouncement(id: string) {
  dismissedAnnouncements.value.push(id)
}
</script>
