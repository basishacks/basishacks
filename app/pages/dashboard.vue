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
  console.log(JSON.stringify(state))
  console.log(JSON.stringify(data.value?.team))
  isDirty.value =
    !data.value?.team || // should never happen???
    state.name !== data.value.team.name ||
    state.project_name !== data.value.team.project_name ||
    state.project_description !== data.value.team.project_description ||
    state.project_demo_url !== (data.value.team.project_demo_url || '') ||
    state.project_repo_url !== (data.value.team.project_repo_url || '')
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

    <div v-if="!data?.team">
      <p class="mb-4">
        Welcome <span class="bold">{{ data!.name || data!.email }}</span
        >! You don't have a team yet. You can
        <ULink href="/teams/new">create a team</ULink> or ask a member from
        another team to add you!
      </p>
      <p v-if="hackathon?.status === 'not_started'" class="mb-4">
        (Don't worry though, you can also create or join a team during the
        hackathon :)
      </p>
    </div>

    <template v-else>
      <p class="mb-4">
        Welcome <span class="bold">{{ data.name || data.email }}</span
        >!
        <template v-if="hackathon?.status === 'not_started'">
          The hackathon hasn't started yet - please check the timer on the home
          page!
        </template>
        <template v-else-if="hackathon?.status === 'in_progress'">
          The hackathon is in progress - <span class="glow">HACK AWAY!</span>
        </template>
        <template v-else-if="hackathon?.status === 'voting'">
          The hackathon is completed, and peer voting is underway!
        </template>
        <template v-else-if="hackathon?.status === 'finished'">
          The hackathon is completed, and the scores are released!
        </template>
        <template v-else-if="hackathon?.status === 'paused'">
          The hackathon is paused as the organizers figure out the secrets of
          the universe... Please check back later!
        </template>
      </p>
      <p class="mb-4">
        Please review the <ULink href="/rules">rules page</ULink> for the most
        up-to-date rules and requirements.
      </p>

      <h2 class="text-3xl bold mb-4">Your team</h2>
      <TeamForm :id="data.team.id" @refresh="refreshData" />

      <template v-if="hackathon?.status !== 'not_started'">
        <h2 class="text-3xl bold mb-4">Your project</h2>
        <ProjectForm
          :team="data.team"
          :disabled="hackathon?.status !== 'in_progress'"
          @update="updateData"
          @refresh="refreshData"
        />
      </template>
    </template>
  </div>
</template>
