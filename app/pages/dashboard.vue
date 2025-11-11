<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { data, error } = await useFetch('/api/me')
if (error.value) {
  throw error.value
}
</script>

<template>
  <div>{{ data }}</div>
</template>
