<script setup lang="ts">
const { date } = defineProps<{
  date: Date
}>()

const text = computed(() =>
  date.toLocaleString('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
)
</script>

<template>
  <time :datetime="date.toISOString()">{{ text }}</time>
</template>
