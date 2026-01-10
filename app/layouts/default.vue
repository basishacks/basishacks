<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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
    {
      label: "Voting",
      to: "/voting",
      icon: "i-material-symbols-how-to-vote",
    }
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
