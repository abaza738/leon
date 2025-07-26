<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'soft' | 'danger' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const {variant = 'primary', size = 'md', disabled = false, type = 'button'} = defineProps<Props>()

const buttonClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer'

  // Size variants with proper gap for icons
  const sizeClasses = {
    xs: 'gap-x-1.5 rounded-sm px-2 py-1 text-xs',
    sm: 'gap-x-1.5 rounded-sm px-2 py-1 text-sm',
    md: 'gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm',
    lg: 'gap-x-1.5 rounded-md px-3 py-2 text-sm',
    xl: 'gap-x-2 rounded-md px-3.5 py-2.5 text-sm'
  }

  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    secondary: 'bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50',
    soft: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
    ghost: 'text-gray-900'
  }

  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [baseClasses, sizeClasses[size], variantClasses[variant], disabledClasses]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>
