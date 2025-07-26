import {ref} from 'vue'

export interface Toast {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  open: boolean
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (toast: Omit<Toast, 'id' | 'open'>) => {
    const newToast: Toast = {
      ...toast,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      open: true
    }

    toasts.value.push(newToast)

    // Keep only the last 5 toasts
    if (toasts.value.length > 5) {
      const oldestToast = toasts.value[0]
      if (oldestToast) removeToast(oldestToast.id)
    }

    // Auto remove after duration
    if (toast.duration !== 0) {
      useTimeoutFn(() => removeToast(newToast.id), toast.duration || 5000)
    }

    return newToast.id
  }

  const removeToast = (id: string) => {
    const toast = toasts.value.find((t) => t.id === id)
    if (toast) {
      toast.open = false
      // Remove from array after animation completes
      useTimeoutFn(() => {
        const index = toasts.value.findIndex((t) => t.id === id)
        if (index > -1) toasts.value.splice(index, 1)
      }, 300)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  // Convenience methods
  const success = (message: string, title?: string, duration?: number) =>
    addToast({message, title, type: 'success', duration})

  const error = (message: string, title?: string, duration?: number) =>
    addToast({message, title, type: 'error', duration})

  const warning = (message: string, title?: string, duration?: number) =>
    addToast({message, title, type: 'warning', duration})

  const info = (message: string, title?: string, duration?: number) =>
    addToast({message, title, type: 'info', duration})

  return {
    toasts,

    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
