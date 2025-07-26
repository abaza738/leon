<script setup lang="ts">
import {X} from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'

export type DialogProps = {
  // Content props
  title?: string
  description?: string

  // Trigger button props
  triggerText?: string
  triggerVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  triggerSize?: 'sm' | 'md' | 'lg'
  triggerClass?: string

  // Dialog styling props
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  showCloseButton?: boolean
  preventCloseOnOutsideClick?: boolean
  preventCloseOnEscape?: boolean
  modal?: boolean
  defaultOpen?: boolean

  // Custom classes
  overlayClass?: string
  contentClass?: string
  headerClass?: string
  bodyClass?: string
  footerClass?: string
}

const {
  triggerVariant = 'primary',
  triggerSize = 'md',
  maxWidth = 'lg',
  showCloseButton = true,
  preventCloseOnOutsideClick = false,
  preventCloseOnEscape = false,
  modal = true
} = defineProps<DialogProps>()

const open = defineModel<boolean>('open')

const triggerVariantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 border-transparent',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 border-transparent',
  outline: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
  ghost: 'border-transparent text-gray-700 hover:bg-gray-100 focus:ring-indigo-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent'
}

const triggerSizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl'
}
</script>

<template>
  <DialogRoot
    v-model:open="open"
    :default-open="defaultOpen"
    :modal="modal"
  >
    <!-- Trigger button (optional) -->
    <DialogTrigger
      v-if="$slots.trigger || triggerText"
      :class="[
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border',
        triggerVariantClasses[triggerVariant],
        triggerSizeClasses[triggerSize],
        triggerClass
      ]"
    >
      <slot name="trigger">{{ triggerText }}</slot>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay
        :class="[
          'fixed inset-0 bg-gray-500/75 transition-opacity z-10 dialog-overlay flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0',
          overlayClass
        ]"
        aria-hidden="true"
      >
        <DialogContent
          :class="[
            'dialog-panel relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 max-h-[90vh] overflow-y-auto',
            maxWidthClasses[maxWidth],
            contentClass
          ]"
          @escapeKeyDown="preventCloseOnEscape ? $event.preventDefault() : (open = false)"
          @interactOutside="preventCloseOnOutsideClick ? $event.preventDefault() : (open = false)"
        >
          <!-- Always render DialogTitle for accessibility as direct child -->
          <DialogTitle class="sr-only">
            <slot name="title">{{ title || 'Dialog' }}</slot>
          </DialogTitle>

          <DialogDescription class="sr-only">
            <slot name="description">{{ description || 'Dialog content' }}</slot>
          </DialogDescription>

          <!-- Close button -->
          <div
            v-if="showCloseButton"
            class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block"
          >
            <DialogClose
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            >
              <span class="sr-only">Close</span>
              <slot name="close-icon">
                <X class="size-6" />
              </slot>
            </DialogClose>
          </div>

          <!-- Visible Title and Description for UI -->
          <div v-if="title || description || $slots.title || $slots.description">
            <h3
              v-if="title || $slots.title"
              class="text-base font-semibold text-gray-900"
            >
              <slot name="title">{{ title }}</slot>
            </h3>

            <div
              v-if="description || $slots.description"
              class="mt-2"
            >
              <p class="text-sm text-gray-500">
                <slot name="description">{{ description }}</slot>
              </p>
            </div>
          </div>

          <!-- Header with icon and content -->
          <div
            v-if="$slots.header || $slots.icon"
            class="sm:flex sm:items-start"
          >
            <!-- Icon slot -->
            <div
              v-if="$slots.icon"
              class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
            >
              <slot name="icon" />
            </div>

            <!-- Custom header content -->
            <div
              v-if="$slots.header"
              :class="[
                'mt-3 text-center sm:mt-0 sm:text-left',
                $slots.icon ? 'sm:ml-4' : '',
                headerClass
              ]"
            >
              <slot name="header" />
            </div>
          </div>

          <!-- Body -->
          <div
            v-if="$slots.default"
            :class="[
              title ||
              description ||
              $slots.title ||
              $slots.description ||
              $slots.header ||
              $slots.icon
                ? 'mt-5 sm:mt-4'
                : '',
              bodyClass
            ]"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            :class="['mt-5 sm:mt-4 sm:flex sm:flex-row-reverse', footerClass]"
          >
            <slot name="footer" />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* Dialog overlay animations */
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

/* Dialog content panel animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate3d(0, 1rem, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInSm {
  from {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 1rem, 0);
  }
}

@keyframes slideOutSm {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0.95);
  }
}

/* Apply animations based on data-state from Reka UI */
.dialog-overlay[data-state='open'] {
  animation: fadeIn 300ms ease-out;
}

.dialog-overlay[data-state='closed'] {
  animation: fadeOut 200ms ease-in;
}

.dialog-content[data-state='open'] .dialog-panel {
  animation: slideIn 300ms ease-out;
}

.dialog-content[data-state='closed'] .dialog-panel {
  animation: slideOut 200ms ease-in;
}

/* Responsive animations for smaller screens */
@media (min-width: 640px) {
  .dialog-content[data-state='open'] .dialog-panel {
    animation: slideInSm 300ms ease-out;
  }

  .dialog-content[data-state='closed'] .dialog-panel {
    animation: slideOutSm 200ms ease-in;
  }
}
</style>
