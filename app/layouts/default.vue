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
  ]
  return links
})
</script>

<template>
  <div>
    <UHeader class="mb-4">
      <template #title>
        <span class="text-primary">basishacks_2026</span>
      </template>

      <UNavigationMenu :items="navItems" />

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
