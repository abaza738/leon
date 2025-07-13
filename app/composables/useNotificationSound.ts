import { useLocalStorage } from '@vueuse/core'
import { ref, onMounted } from 'vue'

const SOUND_URL = '/sounds/notification.mp3'

export function useNotificationSound() {
  // Persist mute state in localStorage
  const isMuted = useLocalStorage('admin-notification-muted', false)
  const audio = ref<HTMLAudioElement | null>(null)

  onMounted(() => {
    if (process.client && !audio.value) {
      audio.value = new Audio(SOUND_URL)
      audio.value.preload = 'auto'
    }
  })

  function play() {
    if (!isMuted.value && audio.value && process.client) {
      audio.value.currentTime = 0
      audio.value.play().catch(() => {
        // Ignore play errors (e.g., autoplay policy)
      })
    }
  }

  function playTest() {
    // Always play test sound regardless of mute state
    if (audio.value && process.client) {
      audio.value.currentTime = 0
      audio.value.play().catch(() => {
        // Ignore play errors (e.g., autoplay policy)
      })
    }
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
    // Play test sound when unmuting
    if (!isMuted.value) {
      playTest()
    }
  }

  return {
    isMuted,
    play,
    playTest,
    toggleMute,
  }
}
