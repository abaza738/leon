<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div
        class="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0"
      >
        <!-- Left side - Made with love -->
        <p class="text-sm text-gray-600 order-2 md:order-1"> Made with ❤️ by ARD Labs </p>

        <!-- Right side - Copyright -->
        <p class="text-sm text-gray-600 order-1 md:order-2">
          © {{ new Date().getFullYear() }} Leon's Restaurant. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped></style>
