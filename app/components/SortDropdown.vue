<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
    >
      <SelectValue placeholder="Sort" />
      <SelectIcon>
        <ChevronDownIcon
          class="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
        />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none"
        position="popper"
        :side-offset="5"
        side="bottom"
        align="end"
      >
        <SelectViewport class="py-1">
          <SelectItem
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
            class="block px-4 py-2 text-sm w-full text-left cursor-pointer hover:bg-gray-50 focus:outline-none focus:bg-gray-50 data-[state=checked]:font-medium data-[state=checked]:text-gray-900 data-[state=unchecked]:text-gray-500"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'
import {ChevronDownIcon} from 'lucide-vue-next'

type SortOption = {label: string; value: string}

type Props = {sortOptions: SortOption[]}

const props = defineProps<Props>()
const model = defineModel<string>({required: true})
</script>
