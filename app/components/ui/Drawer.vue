<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="drawer-overlay fixed inset-0 bg-gray-500/75 z-50" />

      <DialogContent
        :class="['drawer-content fixed bg-white shadow-xl z-50', positionClasses, sizeClasses]"
        @pointer-down-outside="onPointerDownOutside"
        @escape-key-down="onEscapeKeyDown"
      >
        <div class="flex h-full flex-col">
          <!-- Header -->
          <div class="flex items-start justify-between px-4 py-6 sm:px-6">
            <div>
              <DialogTitle
                v-if="title"
                class="text-lg font-medium text-gray-900"
              >
                {{ title }}
              </DialogTitle>
              <slot name="title" />

              <DialogDescription
                v-if="description"
                class="mt-1 text-sm text-gray-500"
              >
                {{ description }}
              </DialogDescription>
              <DialogDescription
                v-else
                class="sr-only"
              >
                Drawer content
              </DialogDescription>
              <slot name="description" />
            </div>

            <div class="ml-3 flex h-7 items-center">
              <DialogClose as-child>
                <button
                  type="button"
                  class="relative -m-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
                  :aria-label="closeLabel"
                >
                  <span class="absolute -inset-0.5"></span>
                  <span class="sr-only">{{ closeLabel }}</span>
                  <slot name="close-icon">
                    <XIcon class="size-6" />
                  </slot>
                </button>
              </DialogClose>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-6">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="border-t border-gray-200 px-4 py-6 sm:px-6"
          >
            <slot name="footer" />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'reka-ui'
import {XIcon} from 'lucide-vue-next'

type Props = {
  title?: string
  description?: string
  position?: 'right' | 'left' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeLabel?: string
  preventClose?: boolean
}

type Emits = {(e: 'close'): void}

const {
  position = 'right',
  size = 'md',
  closeLabel = 'Close panel',
  preventClose = false
} = defineProps<Props>()

const emit = defineEmits<Emits>()

const open = defineModel<boolean>('open', {default: false})

const openDrawer = () => {
  open.value = true
}

const closeDrawer = () => {
  open.value = false
  emit('close')
}

const toggleDrawer = () => {
  if (open.value) {
    closeDrawer()
  } else {
    openDrawer()
  }
}

defineExpose({
  open: openDrawer,
  close: closeDrawer,
  toggle: toggleDrawer,
  isOpen: readonly(open)
})

const positionClasses = computed(() => {
  const positions = {
    right: 'inset-y-0 right-0 drawer-right',
    left: 'inset-y-0 left-0 drawer-left',
    top: 'inset-x-0 top-0 drawer-top',
    bottom: 'inset-x-0 bottom-0 drawer-bottom'
  }
  return positions[position]
})

const sizeClasses = computed(() => {
  if (position === 'top' || position === 'bottom') {
    const sizes = {
      sm: 'h-1/4',
      md: 'h-1/3',
      lg: 'h-1/2',
      xl: 'h-2/3',
      full: 'h-full'
    }
    return sizes[size]
  } else {
    const sizes = {
      sm: 'w-80',
      md: 'w-96',
      lg: 'w-1/2 max-w-md',
      xl: 'w-1/2 max-w-lg',
      full: 'w-full'
    }
    return sizes[size]
  }
})

const onPointerDownOutside = (event: any) => {
  if (preventClose) {
    event.preventDefault()
  }
}

const onEscapeKeyDown = (event: any) => {
  if (preventClose) {
    event.preventDefault()
  } else {
    closeDrawer()
  }
}
</script>

<style scoped>
/* Overlay animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.drawer-overlay[data-state='open'] {
  animation: fadeIn 300ms ease-out;
}

.drawer-overlay[data-state='closed'] {
  animation: fadeOut 300ms ease-in;
}

/* Content animations */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slideInTop {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideOutTop {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@keyframes slideInBottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideOutBottom {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

/* Right drawer animations */
.drawer-content.drawer-right[data-state='open'] {
  animation: slideInRight 300ms ease-out;
}

.drawer-content.drawer-right[data-state='closed'] {
  animation: slideOutRight 300ms ease-in;
}

/* Left drawer animations */
.drawer-content.drawer-left[data-state='open'] {
  animation: slideInLeft 300ms ease-out;
}

.drawer-content.drawer-left[data-state='closed'] {
  animation: slideOutLeft 300ms ease-in;
}

/* Top drawer animations */
.drawer-content.drawer-top[data-state='open'] {
  animation: slideInTop 300ms ease-out;
}

.drawer-content.drawer-top[data-state='closed'] {
  animation: slideOutTop 300ms ease-in;
}

/* Bottom drawer animations */
.drawer-content.drawer-bottom[data-state='open'] {
  animation: slideInBottom 300ms ease-out;
}

.drawer-content.drawer-bottom[data-state='closed'] {
  animation: slideOutBottom 300ms ease-in;
}
</style>
