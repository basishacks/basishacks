<script setup lang="ts">
defineProps<{
  team: APITeam
}>()
</script>

<template>
  <UCard variant="subtle">
    <h2 class="bold text-2xl mb-2">{{ team.project.name }}</h2>
    <p class="mb-4">Team: {{ team.name }} ({{ team.id }})</p>
    <pre class="mb-4 mx-[2ch]">{{ team.project.description }}</pre>
    <div class="flex flex-wrap gap-2">
      <UTooltip :text="team.project.repo_url!">
        <UButton
          variant="subtle"
          icon="i-material-symbols-merge"
          :href="team.project.repo_url!"
          external
          target="_blank"
          >Repo</UButton
        >
      </UTooltip>
      <UTooltip :text="team.project.demo_url!">
        <UButton
          variant="subtle"
          icon="i-material-symbols-play-arrow"
          :href="team.project.demo_url!"
          external
          target="_blank"
          >Demo</UButton
        >
      </UTooltip>
    </div>

    <hr class="text-neutral-500 my-4" />
  </UCard>
</template>
