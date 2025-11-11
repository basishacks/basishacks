<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
useHead({
  title: 'Dashboard | basishacks_2026',
})

const { data: hackathon, error: hackathonError } = await useFetch(
  '/api/hackathon'
)
if (hackathonError.value) {
  throw hackathonError.value
}

const { data, error } = await useFetch<GetUserResponse>('/api/me')
if (error.value) {
  throw error.value
}
</script>

<template>
  <div>
    <h1 class="text-4xl text-primary bold glow mb-4">Dashboard</h1>

    <p v-if="!data?.team" class="mb-4">
      You don't have a team yet. You can
      <ULink href="/teams/new">create a team</ULink> or ask a member from
      another team to add you!
    </p>

    <p>{{ hackathon }}</p>
  </div>
</template>
