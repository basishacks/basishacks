<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { UpdateTeamRequest } from '~~/shared/schemas'

const { team: defaultTeam } = defineProps<{
  team: APITeam
  disabled?: boolean
}>()
const emit = defineEmits<{
  dirty: [dirty: boolean]
  refresh: []
}>()

const formRef = useTemplateRef('formRef')

const toast = useToast()

watch(
  () => formRef.value?.dirty,
  (value) => {
    emit('dirty', value ?? true)
  },
  { deep: true }
)

const state = reactive({
  name: '',
  project: {
    name: '',
    description: '',
    repo_url: '',
    demo_url: '',
  },
})

// Tooltip text and visibility for the demo URL field
const demoUrlHelp = `Provide a publicly accessible demo URL (https://...). This field is read-only for submitted teams.`
const showDemoHelp = ref(false)
function showHelp() {
  showDemoHelp.value = true
}
function hideHelp() {
  showDemoHelp.value = false
}

watch(
  () => defaultTeam,
  (value) => {
    state.name = value.name
    state.project.name = value.project.name
    state.project.description = value.project.description
    state.project.repo_url = value.project.repo_url || ''
    state.project.demo_url = value.project.demo_url || ''
  },
  { deep: true, immediate: true }
)

async function onSubmit(event: FormSubmitEvent<UpdateTeamRequest>) {
  const isSubmit = event.submitter?.id === 'project-submit'
  if (isSubmit) {
    alert('Not implemented yet!')
    return
  }

  const payload = {
    ...event.data,
    project: {
      ...event.data.project,
      demo_url: event.data.project?.demo_url || null,
      repo_url: event.data.project?.repo_url || null,
    },
  }

  try {
    await withLoadingIndicator(async () => {
      const res = await $fetch(`/api/teams/${defaultTeam.id}`, {
        method: 'PATCH',
        body: payload,
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
      description: getErrorMessage(e),
    })
  }
}

const isSpecialTeam = computed(() => {
  return defaultTeam.flags.includes("project.disable.editProject")
})


</script>

<template>
  <UForm
    ref="formRef"
    :state="state"
    :schema="UpdateTeamRequest"
    class="max-w-[600px] space-y-4 mb-4"
    @submit="onSubmit"
  >
    <UFormField
      name="project.name"
      label="Project name"
      help="Make it sound even cooler!"
    >
      <LimitedInput v-model="state.project.name" class="w-full" :disabled="isSpecialTeam" :maxlength="50"/>
    </UFormField>

    <UFormField name="project.description" label="Project description">
      <UTextarea v-model="state.project.description" :rows="10" class="w-full" :disabled="isSpecialTeam" />

      <template #help>
        <p>Please include:</p>
        <p>* A brief summary of the project</p>
        <p>* What problem it solves (if any)</p>
        <p>* How to use it</p>
        <p>* Technologies used (optional)</p>
      </template>
    </UFormField>

    <UFormField name="project.demo_url" label="Demo URL">
      <div class="relative">
        <UInput v-model="state.project.demo_url" class="w-full" :disabled="isSpecialTeam"/>
      </div>

      <template #help>
        This should allow anyone can experience your project. For more
        information, please review the hackathon rules.
      </template>
    </UFormField>

    <UFormField name="project.repo_url" label="Repository URL">
      <UInput v-model="state.project.repo_url" class="w-full" :disabled="isSpecialTeam" />

      <template #help>
        Your project must be open source on
        <ULink href="https://github.com" target="_blank">GitHub</ULink>
        (preferred) or
        <ULink href="https://gitee.com" target="_blank">Gitee</ULink>.
      </template>
    </UFormField>

    <div class="flex gap-4" v-if=!isSpecialTeam>
      <UButton id="project-save" variant="subtle" type="submit">Save</UButton>
      <UButton id="project-submit" type="submit">Submit</UButton>
    </div>
    <NotificationBanner v-if="isSpecialTeam">
      <template #icon>
          <Icon name="i-material-symbols-edit-off"/>
      </template>
      <template #body>
          Unable to edit, save, or submit this project
      </template>
  </NotificationBanner>
  </UForm>
</template>
