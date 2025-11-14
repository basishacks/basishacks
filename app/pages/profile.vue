<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { UpdateUserNameRequest } from '~~/shared/schemas'

const toast = useToast()

definePageMeta({
  middleware: 'auth',
})

const { clear } = useUserSession()

const { data, error } = await useFetch<GetUserResponse>('/api/me')
if (error.value) {
  throw error.value
}

const user = computed(() => data.value!)

async function doLogout() {
  await clear()
  await navigateTo('/')
}

// edit form

const state = reactive({
  name: user.value.name || '',
})

async function onSubmitName(event: FormSubmitEvent<UpdateUserNameRequest>) {
  try {
    const { message } = await withLoadingIndicator(async () => {
      return $fetch('/api/me', {
        method: 'PATCH',
        body: event.data,
      })
    })
    toast.add({
      color: 'success',
      title: message,
    })
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to update profile',
      description: String(e),
    })
  }
}
</script>

<template>
  <div>
    <h1 class="text-4xl bold mb-4">Hi, {{ user.name || user.email }}!</h1>

    <p class="mb-4">You are a {{ WEBSITE_NAME }} participant.</p>

    <UForm
      :state="state"
      :schema="UpdateUserNameRequest"
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
