<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { UpdateTeamRequest } from '~~/shared/schemas'

const { team: defaultTeam } = defineProps<{
  team: Team
}>()
const emit = defineEmits<{
  update: [state: typeof state]
  refresh: []
}>()

const toast = useToast()

const state = reactive({
  name: '',
  project_name: '',
  project_description: '',
  project_demo_url: '',
  project_repo_url: '',
})

watch(state, (value) => emit('update', value), { deep: true, immediate: false })

function updateStateFromTeam() {
  state.name = defaultTeam.name
  state.project_name = defaultTeam.project_name
  state.project_description = defaultTeam.project_description
  state.project_demo_url = defaultTeam.project_demo_url || ''
  state.project_repo_url = defaultTeam.project_repo_url || ''
}

watch(() => defaultTeam, updateStateFromTeam, { deep: true, immediate: true })

async function onSubmit(event: FormSubmitEvent<UpdateTeamRequest>) {
  const isSubmit = event.submitter?.id === 'project-submit'
  if (isSubmit) {
    alert('Not implemented yet!')
    return
  }

  try {
    await withLoadingIndicator(async () => {
      const res = await $fetch(`/api/teams/${defaultTeam.id}`, {
        method: 'PUT',
        body: event.data,
      })
      toast.add({
        color: 'success',
        title: res.message,
      })
    })
    emit('refresh')
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to update project',
      description: String(e),
    })
  }
}
</script>

<template>
  <UForm
    :state="state"
    :schema="UpdateTeamRequest"
    class="max-w-[600px] space-y-4 mb-4"
    @submit="onSubmit"
  >
    <UFormField name="name" label="Team name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>

    <UFormField name="project_name" label="Project name">
      <UInput v-model="state.project_name" class="w-full" />
    </UFormField>

    <UFormField name="project_description" label="Project description">
      <UTextarea
        v-model="state.project_description"
        :rows="10"
        class="w-full"
      />
    </UFormField>

    <UFormField name="project_demo_url" label="Demo URL">
      <UInput v-model="state.project_demo_url" class="w-full" />
    </UFormField>

    <UFormField name="project_repo_url" label="Repository URL">
      <UInput v-model="state.project_repo_url" class="w-full" />
    </UFormField>

    <div class="flex gap-4">
      <UButton id="project-save" variant="subtle" type="submit">Save</UButton>
      <UButton id="project-submit" type="submit">Submit</UButton>
    </div>
  </UForm>
</template>
