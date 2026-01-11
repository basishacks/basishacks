<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { UpdateUserRequest } from '~~/shared/schemas'

const toast = useToast()

const { user: userRef, clear } = useUserSession()
const userID = computed(() => userRef.value?.id ?? 0)

const { data, error, refresh } = await useFetch<GetUserResponse>(
  () => `/api/users/${userID.value}`
)
if (error.value) {
  throw error.value
}

const user = computed(() => data.value!)
const userRole = computed(() => {
  if (user.value.flags.includes('admin')) return 'admin'
  if (user.value.flags.includes('voting.view')) return 'judge'
  return 'participant'
})

const isJudge = computed(() => userRole.value === 'judge')

async function doLogout() {
  await clear()
  await navigateTo('/')
}

// edit form

const state = reactive({
  name: user.value.name || '',
})

async function onSubmitName(event: FormSubmitEvent<UpdateUserRequest>) {
  try {
    const { message } = await withLoadingIndicator(async () => {
      return $fetch<UpdateUserResponse>(`/api/users/${userID.value}`, {
        method: 'PATCH',
        body: event.data,
      })
    })
    toast.add({
      color: 'success',
      title: message,
    })
    await refresh()
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to update profile',
      description: getErrorMessage(e),
    })
  }
}


</script>

<script lang="ts">
const { data, error } = await useFetch('/api/hackathon')
if (error.value) {
  throw error.value
}
const hackathon = computed(() => data.value!)

const status = computed(() => hackathon.value.status)
</script>

<template>
  <div>
    <h1 class="text-4xl bold mb-4">Hi, {{ user.name || user.email }}!</h1>

    <p class="mb-4">You are a {{ WEBSITE_NAME }} {{ userRole }}.</p>

    <ULink href="/dashboard">
      <UAlert v-if="status == 'voting' && isJudge" variant="soft" class="mb-4">
        <template #title>
          <span class="bold">
            The hackathon is now in the voting phase!
          </span>
          Click here to vote, or click on the "Voting" tab in the navigation bar.
        </template>
      </UAlert>
    </ULink>

    <UForm
      :state="state"
      :schema="UpdateUserRequest"
      class="max-w-[600px] space-y-4"
      @submit="onSubmitName"
    >
      <UFormField name="name" label="Edit your name">
        <UInput v-model="state.name" class="w-full" />
      </UFormField>

      <div class="flex gap-4">
        <UButton type="submit">Update profile</UButton>
        <UButton color="warning" variant="subtle" @click="doLogout"
          >Log out</UButton
        >
      </div>
    </UForm>
  </div>
</template>
