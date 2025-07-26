<script setup lang="ts"></script>

<template>
  <main class="relative isolate min-h-screen">
    <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
      <p class="text-base/8 font-semibold text-black">404</p>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-black sm:text-7xl"
        >Page not found</h1
      >
      <p class="mt-6 text-lg font-medium text-pretty text-black/70 sm:text-xl/8"
        >Sorry, we couldn’t find the page you’re looking for.</p
      >
      <div class="mt-10 flex justify-center">
        <nuxt-link
          to="/"
          class="ml-4 text-sm/7 font-semibold text-black"
          ><span aria-hidden="true">&larr;</span> Back to home</nuxt-link
        >
      </div>
    </div>
  </main>
</template>

<style scoped></style>
