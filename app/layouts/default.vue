<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const voting = {
  label: "Voting",
  to: "/voting",
  icon: "i-material-symbols-how-to-vote",
}

import { watch } from 'vue'
const { user: userRef } = useUserSession()
const user = computed(() => userRef.value!)

const currentUser = useState<GetUserResponse | null>('currentUser', () => null)

watch(
  () => userRef.value?.id,
  async (id) => {
    if (!id) {
      currentUser.value = null
      return
    }
    try {
      const { data, error } = await useFetch<GetUserResponse>(() => `/api/users/${id}`)
      if (!error.value) currentUser.value = data.value ?? null
    } catch (e) {
      // ignore — pages can handle missing user state
      console.error('Failed to fetch current user', e)
      currentUser.value = null
    }
  },
  { immediate: true }
)

const navItems = computed<NavigationMenuItem[]>(() => {
  const links = [
    {
      label: 'Home',
      to: '/',
      icon: 'i-material-symbols-home-outline',
    },
    {
      label: 'Dashboard',
      to: '/dashboard',
      icon: 'i-material-symbols-space-dashboard',
    },
    ...(currentUser.value?.flags.includes("voting.view") ? [voting] : []),
  ]
  return links
})



setTimeout(() => {
  console.log("%c" + "HEY, IMPORTANT STUFF", "color: var(--ui-primary); -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;");
console.log("%c" + "You probably shouldn't paste anything here unless you know what you're doing.", "font-size: 32px;");
}, 1000)
</script>


<template>
  <div>
    <UHeader class="mb-4 no-underline">
      <template #title>
        <span class="text-primary">basishacks_2026</span>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UColorModeButton />
        <UButton
          icon="i-material-symbols-account-circle-full"
          variant="ghost"
          href="/profile"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>
  </div>
</template>
