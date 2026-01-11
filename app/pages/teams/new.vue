<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { CreateTeamRequest } from '~~/shared/schemas'

useHead({
  title: `New Team | ${WEBSITE_NAME}`,
})

const toast = useToast()

const state = reactive({
  name: '',
})

async function onSubmit(event: FormSubmitEvent<CreateTeamRequest>) {
  const { name } = event.data

  try {
    await withLoadingIndicator(async () => {
      await $fetch<CreateTeamResponse>('/api/teams', {
        method: 'POST',
        body: { name },
        query: { add: true },
      })
      toast.add({
        color: 'success',
        title: 'Your team is created',
      })
    })
    await navigateTo('/dashboard')
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to create team',
      description: getErrorMessage(e),
    })
  }
}
</script>

<template>
  <div>
    <h1 class="text-4xl bold glow mb-4">Create a team</h1>

    <p class="mb-4">Please fill out this super long form to create a team!</p>

    <UForm
      :state="state"
      :schema="CreateTeamRequest"
      class="space-y-2 max-w-[600px]"
      @submit="onSubmit"
    >
      <UFormField name="name" label="Team name">
        <LimitedInput v-model="state.name" :maxlength="30" />
      </UFormField>

      <UFormField>
        <UButton type="submit">Create</UButton>
      </UFormField>
    </UForm>
  </div>
</template>
