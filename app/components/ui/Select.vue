<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'
import {ChevronsUpDown, Check} from 'lucide-vue-next'

export type SelectOption = {
  label: string
  value: string | number
  disabled?: boolean
}

type Props = {
  options: SelectOption[]
  placeholder?: string
  label?: string
  id?: string
  disabled?: boolean
  required?: boolean
}

const {
  placeholder = 'Select an option...',
  disabled = false,
  required = false
} = defineProps<Props>()

const model = defineModel<string | number>()
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm/6 font-medium text-gray-900"
    >
      {{ label }}
    </label>

    <div class="relative mt-2">
      <SelectRoot
        v-model="model"
        :disabled="disabled"
        :required="required"
      >
        <SelectTrigger
          :id="id"
          class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:outline-gray-200 sm:text-sm/6"
          aria-haspopup="listbox"
        >
          <SelectValue
            :placeholder="placeholder"
            class="col-start-1 row-start-1 truncate pr-6"
          />
          <SelectIcon
            class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          >
            <ChevronsUpDown class="size-4" />
          </SelectIcon>
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            class="select-content z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none sm:text-sm"
            position="popper"
            :side-offset="4"
            align="start"
          >
            <SelectViewport class="select-viewport">
              <SelectItem
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
                class="select-item relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <SelectItemText>
                  <span class="block truncate font-normal">
                    {{ option.label }}
                  </span>
                </SelectItemText>

                <SelectItemIndicator
                  class="select-item-indicator absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
                >
                  <Check class="h-5 w-5" />
                </SelectItemIndicator>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
  </div>
</template>

<style>
.select-content {
  width: var(--reka-select-trigger-width);
  min-width: var(--reka-select-trigger-width);
}

.select-viewport {
  width: 100%;
}

.select-item {
  width: 100%;
  box-sizing: border-box;
}

.select-item[data-highlighted] {
  background-color: rgb(79 70 229);
  color: white;
}

.select-item[data-highlighted] .select-item-indicator {
  color: white;
}
</style>
