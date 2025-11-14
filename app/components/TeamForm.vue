<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { AddTeamMemberRequest, UpdateTeamRequest } from '~~/shared/schemas'

const { id, name } = defineProps<{
  id: number
  name: string
}>()
const emit = defineEmits<{
  refresh: []
}>()

const toast = useToast()

const { user: currentUser } = useUserSession()

const {
  data: users,
  error,
  refresh,
} = await useFetch<GetTeamMembersResponse>(`/api/teams/${id}/users`)
if (error.value) {
  throw error.value
}

async function removeUser(user: Pick<User, 'id' | 'name' | 'email'>) {
  const message = `Are you sure you want to ${
    user.id === currentUser.value?.id
      ? 'leave'
      : `remove ${user.name || user.email} from`
  } your team?${
    users.value?.length === 1
      ? " This is the last member of your team, so you won't be able to recover it."
      : ''
  }`
  if (confirm(message)) {
    try {
      await withLoadingIndicator(async () => {
        const { message } = await $fetch(`/api/teams/${id}/users/${user.id}`, {
          method: 'DELETE',
        })
        toast.add({
          color: 'success',
          title: message,
        })
        if (user.id === currentUser.value?.id) {
          emit('refresh')
        } else {
          await refresh()
        }
      })
    } catch (e) {
      toast.add({
        color: 'error',
        title: 'Failed to remove member',
        description: String(e),
      })
    }
  }
}

// rename
const nameState = reactive({
  name: name,
})

async function onNameSubmit(event: FormSubmitEvent<UpdateTeamRequest>) {
  try {
    await withLoadingIndicator(async () => {
      const { message } = await $fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        body: event.data,
      })
      toast.add({
        color: 'success',
        title: message,
      })
      await refresh()
    })
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to rename team',
      description: String(e),
    })
  }
}

// add user
const state = reactive({
  email: '',
})

async function onSubmit(event: FormSubmitEvent<AddTeamMemberRequest>) {
  try {
    await withLoadingIndicator(async () => {
      const { message } = await $fetch(`/api/teams/${id}/users`, {
        method: 'POST',
        body: event.data,
      })
      toast.add({
        color: 'success',
        title: message,
      })
      await refresh()
    })
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to add member',
      description: String(e),
    })
  }
}
</script>

<template>
  <ul class="grid lg:grid-cols-2 gap-4 mb-4">
    <li v-for="user in users" :key="user.id">
      <UCard variant="subtle">
        <h3 class="flex flex-wrap items-center gap-2">
          <span class="bold">{{ user.name || user.email }}</span>
          <div class="flex-1" />
          <UButton
            icon="i-material-symbols-delete"
            color="warning"
            variant="soft"
            @click="removeUser(user)"
          />
        </h3>
        <p v-if="user.name">{{ user.email }}</p>
      </UCard>
    </li>
  </ul>

  <UForm
    :state="nameState"
    :schema="UpdateTeamRequest"
    class="space-y-2 max-w-[600px] mb-4"
    @submit="onNameSubmit"
  >
    <UFormField name="name" label="Rename team">
      <UInput v-model="nameState.name" class="w-full" />
    </UFormField>

    <UFormField>
      <UButton variant="subtle" type="submit">Rename</UButton>
    </UFormField>
  </UForm>

  <UForm
    :state="state"
    :schema="AddTeamMemberRequest"
    class="space-y-2 max-w-[600px]"
    @submit="onSubmit"
  >
    <UFormField name="email" label="Add team member">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="New member email"
        class="w-full"
      />
    </UFormField>

    <UFormField>
      <UButton variant="subtle" type="submit">Add</UButton>
    </UFormField>
  </UForm>
</template>
