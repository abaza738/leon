<template>
  <div>
    <!-- Desktop Filters -->
    <form class="hidden lg:block">
      <h3 class="sr-only">Categories</h3>
      <ul
        role="list"
        class="border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
      >
        <li>
          <button
            type="button"
            class="cursor-pointer w-full text-left pb-2"
            @click="selectedCategory = null"
            :class="[
              selectedCategory === null ? 'text-indigo-600' : 'text-gray-900 hover:text-gray-800'
            ]"
          >
            All Items
          </button>
        </li>
        <li
          v-for="category in categories"
          :key="category"
        >
          <button
            type="button"
            class="cursor-pointer w-full text-left py-2"
            @click="selectedCategory = category"
            :class="[
              selectedCategory === category
                ? 'text-indigo-600'
                : 'text-gray-900 hover:text-gray-800'
            ]"
          >
            {{ category }}
          </button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup lang="ts">
const {categories} = defineProps<{categories: string[]}>()
const selectedCategory = defineModel<string | null>('selectedCategory')
</script>
