<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
useHead({
  title: `Dashboard | ${WEBSITE_NAME}`,
})

const { data: hackathon, error: hackathonError } = await useFetch(
  '/api/hackathon'
)
if (hackathonError.value) {
  throw hackathonError.value
}
if (hackathon.value?.status === 'not_started') {
  throw navigateTo('/')
}

const { data, error, refresh } = await useFetch<GetUserResponse>('/api/me')
if (error.value) {
  throw error.value
}

async function refreshData() {
  await withLoadingIndicator(async () => {
    await refresh()
  })
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

    <div v-else-if="hackathon?.status === 'in_progress'">
      <p class="mb-4">
        The hackathon is in progress! <span class="glow">HACK AWAY!</span>
      </p>
      <h2 class="text-3xl bold mb-4">Team &amp; project</h2>

      <TeamForm :team="data.team" @update="refreshData" />
    </div>
  </div>
</template>
