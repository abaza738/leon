<template>
  <div class="flex-1 flex flex-col">
    <AnnouncementBanner />
    <Navbar />
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
