<script setup lang="ts">
useHead({
  title: 'basishacks_2026',
})

const { data, error } = await useFetch('/api/hackathon')
if (error.value) {
  throw error.value
}
const hackathon = computed(() => data.value!)

const status = computed(() => hackathon.value.status)
const startDate = computed(() => new Date(hackathon.value.start_timestamp))
const endDate = computed(() => new Date(hackathon.value.end_timestamp))
const votingStartDate = computed(
  () => new Date(hackathon.value.voting_start_timestamp)
)
const votingEndDate = computed(
  () => new Date(hackathon.value.voting_end_timestamp)
)
const resultsOpenDate = computed(
  () => new Date(hackathon.value.results_open_timestamp)
)
</script>

<template>
  <div>
    <h1 class="text-4xl bold mb-4 glow">
      Welcome to <span class="text-primary">basishacks_2026</span>!
    </h1>
    <p class="mb-4">
      This is the official website of Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Ab iste, nostrum corporis ex, quos a aliquid eligendi
      odio earum reiciendis repellendus provident, quibusdam consectetur sint
      illo tenetur qui unde ullam!
    </p>
    <UAlert
      v-if="status !== 'not_started'"
      variant="soft"
      class="mb-4 text-default"
    >
      <template #title>
        The hackathon has {{ status === 'finished' ? 'finished' : 'started' }}!
        <ULink class="text-primary glow-sm" href="/dashboard"
          >Check out your dashboard!</ULink
        >
      </template>
    </UAlert>

    <!-- schedule -->
    <h2 v-if="status !== 'finished'" class="text-3xl bold mb-4 glow-sm">
      Schedule
    </h2>
    <p v-if="status === 'paused'">
      The website is currently under maintenance. Please check back later.
    </p>
    <ul
      v-else-if="status !== 'finished'"
      class="grid grid-cols-1 lg:grid-cols-2 mb-4 gap-4"
    >
      <li v-if="status === 'not_started'">
        <LargeCountdown :date="startDate" label="Hackathon starts" />
      </li>
      <li v-if="status === 'not_started' || status === 'in_progress'">
        <LargeCountdown :date="endDate" label="Hackathon ends" />
      </li>
      <li v-if="status === 'in_progress'">
        <LargeCountdown :date="votingStartDate" label="Voting starts" />
      </li>
      <li v-if="status === 'voting'">
        <LargeCountdown :date="votingEndDate" label="Voting ends" />
      </li>
      <li v-if="status === 'voting'">
        <LargeCountdown :date="resultsOpenDate" label="Results released" />
      </li>
    </ul>

    <UCollapsible class="mb-4">
      <template #default="{ open }">
        <p>{{ open ? '▼' : '▶' }} Detailed schedule</p>
      </template>

      <template #content>
        <ul class="mb-4 whitespace-pre-wrap">
          <li>
            {{ '' }}* Hackathon starts:{{ '  ' }}<DateTime :date="startDate" />
          </li>
          <li>
            {{ '' }}* Hackathon ends:{{ '    ' }}<DateTime :date="endDate" />
          </li>
          <li>
            {{ '' }}* Voting starts:{{ '     '
            }}<DateTime :date="votingStartDate" />
          </li>
          <li>
            {{ '' }}* Voting ends:{{ '       '
            }}<DateTime :date="votingEndDate" />
          </li>
          <li>
            {{ '' }}* Results released:{{ '  '
            }}<DateTime :date="resultsOpenDate" />
          </li>
        </ul>
      </template>
    </UCollapsible>

    <!-- theme -->
    <h2 class="text-3xl bold mb-4 glow-sm">Theme</h2>
    <p class="mb-4">
      The theme of the hackathon will be revealed on
      <DateTime class="bold" :date="startDate" />, at the opening ceremony.
    </p>
  </div>
</template>
