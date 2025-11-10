<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    icon: 'i-material-symbols-home-outline',
  },
])
</script>

<template>
  <div>
    <UHeader class="mb-4">
      <template #title>
        <span class="text-primary">basishacks_2025</span>
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
