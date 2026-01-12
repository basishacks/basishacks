<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { user: userRef } = useUserSession()
const userID = computed(() => userRef.value?.id ?? 0)

const { data: userData, error: userError } = await useFetch<GetUserResponse>(
  () => `/api/users/${userID.value}`
)
if (userError.value) {
  throw userError.value
}
if (userData.value?.role !== 'admin' && userData.value?.role !== 'judge') {
  throw await navigateTo('/')
}

const { data, error } = await useFetch<APITeam[]>('/api/teams')
if (error.value) {
  throw error.value
}
</script>

<template>
  <div>
    <h1 class="text-4xl text-primary bold glow mb-4">Judging</h1>
    <!-- <pre>{{ data }}</pre> -->
    <JudgingCard v-for="team in data" :key="team.id" :team="team" />
  </div>
</template>
