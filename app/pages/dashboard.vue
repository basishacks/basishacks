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

const isDirty = ref(false)

async function refreshData() {
  await withLoadingIndicator(async () => {
    await refresh()
  })
  isDirty.value = false
}

function updateData(state: Omit<Team, 'id'>) {
  isDirty.value =
    !data.value?.team || // should never happen???
    state.name !== data.value.team.name ||
    state.project_name !== data.value.team.project_name ||
    state.project_description !== data.value.team.project_description ||
    state.project_demo_url !== data.value.team.project_demo_url ||
    state.project_repo_url !== data.value.team.project_repo_url
}

onBeforeRouteLeave(() => {
  if (
    isDirty.value &&
    !confirm('You have unsaved changes. Are you sure you want to leave?')
  ) {
    return abortNavigation()
  }
})

function beforeUnload(event: BeforeUnloadEvent) {
  if (isDirty.value) {
    event.preventDefault()
    event.returnValue = true
  }
}

watch(isDirty, (value) => {
  if (value) {
    window.addEventListener('beforeunload', beforeUnload)
  } else {
    window.removeEventListener('beforeunload', beforeUnload)
  }
})
</script>

<template>
  <div>
    <h1 class="text-4xl text-primary bold glow mb-4">Dashboard</h1>

    <p v-if="!data?.team" class="mb-4">
      Welcome <span class="bold">{{ data!.name || data!.email }}</span
      >! You don't have a team yet. You can
      <ULink href="/teams/new">create a team</ULink> or ask a member from
      another team to add you!
    </p>

    <div v-else-if="hackathon?.status === 'in_progress'">
      <p class="mb-4">
        Welcome <span class="bold">{{ data.name || data.email }}</span
        >! The hackathon is in progress - <span class="glow">HACK AWAY!</span>
      </p>
      <h2 class="text-3xl bold mb-4">Team &amp; project</h2>

      <TeamForm :team="data.team" @update="updateData" @refresh="refreshData" />
    </div>
  </div>
</template>
