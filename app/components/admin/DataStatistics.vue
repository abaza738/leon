<template>
  <div class="bg-white py-8 sm:py-12">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:max-w-none">
        <dl :class="['grid gap-0.5 overflow-hidden rounded-2xl text-center', gridCols]">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="flex flex-col bg-gray-400/5 p-8"
          >
            <dt class="text-sm/6 font-semibold text-gray-600">
              {{ stat.label }}
            </dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
              {{ formatValue(stat.value, stat.suffix) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type StatItem = {label: string; value: string | number; suffix?: string}

type Props = {stats: StatItem[]; columns?: number}

const props = withDefaults(defineProps<Props>(), {columns: 4})

const gridCols = computed(() => {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }
  return colsMap[Math.min(props.columns, 6) as keyof typeof colsMap] || colsMap[4]
})

function formatValue(value: string | number, suffix?: string) {
  if (suffix) {
    return `${value} ${suffix}`
  }
  return value
}
</script>
