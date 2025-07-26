<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'reka-ui'
import {ChevronDownIcon} from 'lucide-vue-next'

export type MenuItem = {
  id: string
  label: string
  description?: string
  icon?: any
  href?: string
  action?: string
  disabled?: boolean
  type?: 'item' | 'separator' | 'label'
}

export type MenuGroup = {label?: string; items: MenuItem[]}

type Props = {
  trigger?: string
  items?: MenuItem[]
  groups?: MenuGroup[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  disabled?: boolean
}

const {align = 'end', side = 'bottom', sideOffset = 4, disabled = false} = defineProps<Props>()

const emits = defineEmits<{
  select: [item: MenuItem]
  'item-click': [item: MenuItem]
}>()

function handleItemSelect(item: MenuItem) {
  if (item.disabled) return

  emits('select', item)
  emits('item-click', item)

  if (item.href) {
    navigateTo(item.href)
  }
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger">
        <button
          type="button"
          :disabled="disabled"
          class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ trigger }}
          <ChevronDownIcon class="-mr-1 size-5 text-gray-400" />
        </button>
      </slot>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        ref="menuContent"
        :align="align"
        :side="side"
        :side-offset="sideOffset"
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:duration-100 data-[state=closed]:duration-75"
      >
        <template v-if="groups && groups.length > 0">
          <template
            v-for="(group, groupIndex) in groups"
            :key="groupIndex"
          >
            <div
              class="py-1"
              role="none"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel
                  v-if="group.label"
                  class="px-4 py-3 text-sm font-medium text-gray-900"
                  role="none"
                >
                  {{ group.label }}
                </DropdownMenuLabel>
                <template
                  v-for="(item, itemIndex) in group.items"
                  :key="itemIndex"
                >
                  <DropdownMenuSeparator
                    v-if="item.type === 'separator'"
                    class="my-1 h-px bg-gray-100"
                  />
                  <div
                    v-else-if="item.id === 'user-info'"
                    class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 bg-gray-50 cursor-default select-none"
                    role="presentation"
                  >
                    <component
                      v-if="item.icon"
                      :is="item.icon"
                      class="h-4 w-4 text-gray-500"
                    />
                    <div class="flex flex-col">
                      <span>{{ item.label }}</span>
                      <span
                        v-if="item.description"
                        class="text-xs text-gray-500"
                        >{{ item.description }}</span
                      >
                    </div>
                  </div>
                  <DropdownMenuItem
                    v-else
                    :disabled="item.disabled"
                    :class="[
                      'flex items-center gap-3 px-4 py-2 text-sm',
                      (item.href || item.action) && !item.disabled
                        ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900'
                        : 'cursor-default',
                      'text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                    ]"
                    role="menuitem"
                    tabindex="-1"
                    @select="handleItemSelect(item)"
                  >
                    <component
                      v-if="item.icon"
                      :is="item.icon"
                      class="h-4 w-4 text-gray-500"
                    />
                    <div class="flex flex-col">
                      <span>{{ item.label }}</span>
                      <span
                        v-if="item.description"
                        class="text-xs text-gray-500"
                        >{{ item.description }}</span
                      >
                    </div>
                  </DropdownMenuItem>
                </template>
              </DropdownMenuGroup>
            </div>
          </template>
        </template>

        <!-- Default slot for custom content -->
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped>
/* Animation styles matching Tailwind example */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Apply animations based on Reka UI data states */
:deep([data-state='open']) {
  animation: fadeIn 100ms ease-out;
}

:deep([data-state='closed']) {
  animation: fadeOut 75ms ease-in;
}
</style>
