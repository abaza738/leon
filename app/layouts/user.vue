<template>
  <div class="grid grid-rows-[auto_auto_1fr_auto] min-h-screen">
    <AnnouncementBanner />
    <Navbar />
    <div class="flex flex-col">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts"></script>
