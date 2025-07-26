<template>
  <ToastProvider>
    <ToastPortal>
      <ToastViewport
        class="leon-toast-viewport fixed bottom-0 right-0 flex flex-col justify-end p-6 gap-3 w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none"
      >
        <ToastRoot
          v-for="toast in visibleToasts"
          :key="toast.id"
          v-model:open="toast.open"
          :duration="toast.duration || 5000"
          @update:open="(open) => !open && removeToast(toast.id)"
          class="leon-toast pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white ring-1 shadow-lg ring-black/5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="shrink-0">
                <!-- Success Icon -->
                <CheckCircle
                  v-if="toast.type === 'success'"
                  class="size-6 text-green-400"
                />

                <!-- Error Icon -->
                <XCircle
                  v-else-if="toast.type === 'error'"
                  class="size-6 text-red-400"
                />

                <!-- Warning Icon -->
                <AlertTriangle
                  v-else-if="toast.type === 'warning'"
                  class="size-6 text-yellow-400"
                />

                <!-- Info Icon (default) -->
                <Info
                  v-else
                  class="size-6 text-blue-400"
                />
              </div>

              <div class="ml-3 w-0 flex-1 pt-0.5">
                <ToastTitle
                  v-if="toast.title"
                  class="text-sm font-medium text-gray-900"
                >
                  {{ toast.title }}
                </ToastTitle>
                <ToastDescription class="mt-1 text-sm text-gray-500">
                  {{ toast.message }}
                </ToastDescription>
              </div>

              <div class="ml-4 flex shrink-0">
                <ToastClose
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  <span class="sr-only">Close</span>
                  <X class="size-5" />
                </ToastClose>
              </div>
            </div>
          </div>
        </ToastRoot>
      </ToastViewport>
    </ToastPortal>
  </ToastProvider>
</template>
<script setup lang="ts">
import {
  ToastProvider,
  ToastPortal,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport
} from 'reka-ui'
import {computed} from 'vue'
import {CheckCircle, XCircle, AlertTriangle, Info, X} from 'lucide-vue-next'

// Use the global toast composable directly
const {toasts, removeToast} = useToast()

// Show toasts with newest at bottom
const visibleToasts = computed(() => {
  return [...toasts.value].reverse()
})
</script>

<style>
/* Very specific toast animations using unique class names */
.leon-toast-viewport .leon-toast[data-state='open'] {
  animation: leon-toast-slideIn 250ms ease-out;
}

.leon-toast-viewport .leon-toast[data-state='closed'] {
  animation: leon-toast-slideOut 200ms ease-in;
}

@keyframes leon-toast-slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes leon-toast-slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Swipe gestures - very specific */
.leon-toast-viewport .leon-toast[data-swipe='move'] {
  transform: translateX(var(--reka-toast-swipe-move-x));
}

.leon-toast-viewport .leon-toast[data-swipe='end'] {
  animation: leon-toast-slideOut 150ms ease-in;
}
</style>
