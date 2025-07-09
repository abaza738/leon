<template>
  <div class="flex-1 flex flex-col">
    <div
      class="flex-1 container mx-auto flex flex-col gap-4 p-8 border-l border-r border-primary-800"
    >
      <section class="flex items-center gap-4">
        <div class="flex-1 rounded p-4 text-mint-kiss-800 bg-teal-600">
          <div class="flex items-center gap-4">
            <Icon
              name="solar:cup-hot-bold-duotone"
              size="2rem"
            />
            <h3 class="text-3xl font-bold">12</h3>
          </div>
        </div>

        <div class="flex-1 rounded p-4 text-lavender-haze-800 bg-slate-800">
          <div class="flex items-center gap-4">
            <Icon
              name="solar:clock-circle-bold-duotone"
              size="2rem"
            />
            <h3 class="text-3xl font-bold">3</h3>
          </div>
        </div>

        <div class="flex-1 rounded p-4 text-teal-200 bg-zinc-700">
          <div class="flex items-center gap-4">
            <Icon
              name="solar:dollar-bold-duotone"
              size="2rem"
            />
            <h3 class="text-3xl font-bold">JOD 100</h3>
          </div>
        </div>

        <div class="flex-1 rounded p-4 text-creamy-white-800 bg-sky-300">
          <div class="flex items-center gap-4">
            <Icon
              name="solar:check-circle-bold-duotone"
              size="2rem"
            />
            <h3 class="text-3xl font-bold">52</h3>
          </div>
        </div>
      </section>

      <USeparator
        color="neutral"
        orientation="horizontal"
      />

      <section class="flex-1 flex flex-col gap-4">
        <div class="flex gap-4">
          <div class="flex-[3] flex flex-col gap-4">
            <USkeleton class="bg-neutral-300 h-6 w-52 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
          </div>

          <div class="flex-[1] flex flex-col gap-4">
            <USkeleton class="bg-neutral-300 h-6 w-1/2 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
            <USkeleton class="bg-neutral-300 h-10 rounded" />
          </div>
        </div>

        <USeparator
          color="neutral"
          orientation="horizontal"
        />

        <div class="flex-1 flex gap-4">
          <USkeleton class="bg-neutral-300 flex-1 rounded" />
          <USkeleton class="bg-neutral-300 flex-1 rounded" />
          <USkeleton class="bg-neutral-300 flex-1 rounded" />
          <USkeleton class="bg-neutral-300 flex-1 rounded" />
        </div>
      </section>

      <!-- <div class="flex-1 grid grid-cols-4 gap-4">
        <section class="flex flex-col gap-4">
          <USkeleton class="h-12 rounded" />
          <USkeleton class="flex-1 rounded" />
          <USkeleton class="h-48 rounded" />
        </section>

        <section class="flex flex-col gap-4"></section>

        <section class="flex flex-col gap-4"></section>

        <section class="flex flex-col gap-4"></section>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', name: 'admin', middleware: 'admin' })
</script>
