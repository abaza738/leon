import {useIntervalFn} from '@vueuse/core'

export function useRelativeTime() {
  const now = ref(new Date())

  // Update every 30 seconds for live timestamps
  const {pause, resume} = useIntervalFn(() => {
    now.value = new Date()
  }, 30000)

  function getRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const diffInMs = now.value.getTime() - date.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    // Use proper switch statement for time ranges
    switch (true) {
      case diffInSeconds < 30:
        return 'Just now'
      case diffInSeconds < 60:
        return `${diffInSeconds}s ago`
      case diffInMinutes < 60:
        return `${diffInMinutes}m ago`
      case diffInHours < 24:
        return `${diffInHours}h ago`
      case diffInDays < 7:
        return `${diffInDays}d ago`
      default:
        // For older dates, show formatted date
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.value.getFullYear() ? 'numeric' : undefined
        })
    }
  }

  // Get color class based on recency using switch
  function getTimeColor(dateString: string) {
    const diffInMs = now.value.getTime() - new Date(dateString).getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    switch (true) {
      case diffInMinutes < 5:
        return 'text-green-600' // Very recent
      case diffInMinutes < 30:
        return 'text-blue-600' // Recent
      case diffInMinutes < 60:
        return 'text-yellow-600' // Somewhat old
      default:
        return 'text-gray-600' // Old
    }
  }

  return {
    now: readonly(now),

    getRelativeTime,
    getTimeColor,
    pause,
    resume
  }
}
