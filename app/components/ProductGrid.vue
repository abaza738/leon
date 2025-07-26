<template>
  <div class="lg:col-span-3">
    <div
      v-if="products.length > 0"
      class="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <EmptyState v-else />
  </div>
</template>

<script setup lang="ts">
import type {Product} from '~/types/restaurant'

type Props = {products: Product[]}

defineProps<Props>()
</script>
