<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { User } from '~~/shared/database';
import LimitedInput from '~/components/LimitedInput.vue'
import { AddTeamMemberRequest, UpdateTeamRequest } from '~~/shared/schemas'

const { team } = defineProps<{
  team: APITeam
}>()
const emit = defineEmits<{
  refresh: []
}>()

const { id, name } = team

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
        description: getErrorMessage(e),
      })
    }
  }
}

// rename
const nameState = reactive({
  name: name,
})

async function onNameSubmit(
  event: FormSubmitEvent<UpdateTeamRequest>,
  close: () => void
) {
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
      emit('refresh')
      await refresh()
    })
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to rename team',
      description: getErrorMessage(e),
    })
  } finally {
    close()
  }
}

// add user
const state = reactive({
  email: '',
})

async function onSubmit(
  event: FormSubmitEvent<AddTeamMemberRequest>,
  close: () => void
) {
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
      emit('refresh')
      await refresh()
    })
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to add member',
      description: getErrorMessage(e),
    })
  } finally {
    close()
  }
}

const disableEditTeamName = computed(() => {
  return team.flags.includes('team.disable.editTeamName')
})

const disableAddTeamMember = computed(() => {
  return team.flags.includes('team.disable.addTeammate')
})


</script>

<template>
  <div>

    <h2 class="text-3xl bold mb-4 flex gap-4">
      <span>
        Your team: <span class="glow">{{ team.name }}</span>
      </span>

      <UModal title="Rename team">
        <UButton
          variant="soft"
          icon="i-material-symbols-drive-file-rename-outline"
          :disabled=disableEditTeamName
        />

        <template #body="{ close }">
          <UForm
            :state="nameState"
            :schema="UpdateTeamRequest"
            class="space-y-2 max-w-[600px]"
            @submit="onNameSubmit($event, close)"
          >
            <UFormField name="name" label="New name">
              <LimitedInput v-model="nameState.name" :maxlength="30" class="w-full" />
            </UFormField>

            <UFormField>
              <UButton variant="subtle" type="submit">Rename</UButton>
            </UFormField>
          </UForm>
        </template>
      </UModal>

      <UModal title="Add team member">
        <UButton variant="soft" icon="i-material-symbols-person-add" 
        :disabled=disableAddTeamMember
        />
        <template #body="{ close }">
          <UForm
            :state="state"
            :schema="AddTeamMemberRequest"
            class="space-y-2 max-w-[600px]"
            @submit="onSubmit($event, close)"
          >
            <UFormField name="email" label="New member email">
              <UInput v-model="state.email" type="email" class="w-full" />
            </UFormField>

            <UFormField>
              <UButton variant="subtle" type="submit">Add</UButton>
            </UFormField>
          </UForm>
        </template>
      </UModal>
    </h2>

    

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
  </div>


</template>
