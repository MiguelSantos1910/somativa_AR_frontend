<template>
  <div class="w-mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-col gap-2 md:flex-col md:flex-col md:items-baseline px-2">
        <div>
            <img :is="icon" :size="size" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ titulo }}
      </h3>
      <section class="px-1">
        <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {{ descricao }}
        </p>
      </section>
    </div>
  </div>
</template>
<script setup>
defineProps({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    icon: {
        type: Object,
        required: false
    },
    size: {
        type: Number,
        required: true
    }
})
</script>