<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { LoginRequest, SendCodeRequest } from '~~/shared/schemas'

useHead({
  title: `Login | ${WEBSITE_NAME}`,
})

const toast = useToast()
const { fetch: refreshAuth } = useUserSession()

const isSendingCode = ref(true)

const state = reactive({
  email: '',
  code: '',
})

async function onSendCodeSubmit(event: FormSubmitEvent<SendCodeRequest>) {
  const { email } = event.data

  try {
    await withLoadingIndicator(async () => {
      const res = await $fetch('/api/auth/code', {
        method: 'POST',
        body: { email },
      })
      toast.add({
        color: 'success',
        title: res.message,
        description: 'Please enter the code to log in',
      })
      isSendingCode.value = false
    })
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to send verification code',
      description: String(e),
    })
  }
}

async function onLoginSubmit(event: FormSubmitEvent<LoginRequest>) {
  const { email, code } = event.data

  try {
    await withLoadingIndicator(async () => {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, code },
      })
      await refreshAuth()
      toast.add({
        color: 'success',
        title: res.message,
      })
    })
    await navigateTo('/dashboard')
  } catch (e) {
    toast.add({
      color: 'error',
      title: 'Failed to log in',
      description: String(e),
    })
  }
}
</script>

<template>
  <div>
    <h1 class="text-4xl bold mb-4">Log in</h1>

    <p class="mb-4">Please log in using the form below.</p>

    <UForm
      v-if="isSendingCode"
      :state="state"
      :schema="SendCodeRequest"
      class="max-w-[600px] space-y-4"
      @submit="onSendCodeSubmit"
    >
      <UFormField name="email" label="Email">
        <UInput v-model="state.email" type="email" class="w-full" />
      </UFormField>

      <UButton type="submit">Send verification code</UButton>
    </UForm>

    <UForm
      v-else
      :state="state"
      :schema="LoginRequest"
      class="max-w-96 space-y-4"
      @submit="onLoginSubmit"
    >
      <UFormField name="email" label="Email">
        <UInput v-model="state.email" disabled type="email" class="w-full" />
      </UFormField>

      <UFormField name="code" label="Verification code">
        <UInput v-model="state.code" class="w-full" />
      </UFormField>

      <UButton type="submit">Log in</UButton>
    </UForm>
  </div>
</template>
