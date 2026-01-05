export default defineEventHandler(async (event) => {
  // In a real app, this would fetch the next project to grade based on user authentication
  // For demo, return a dummy project

  const dummyProjects = [
    {
      id: 'P-001',
      title: 'OpenHealth',
      team: 'Team Aces',
      category: 'Healthcare',
      abstract: 'An open platform for connecting patients and volunteers.',
      members: ['Alice', 'Bob', 'Carlos'],
      readmeRawUrl: 'https://raw.githubusercontent.com/basishacks/basishacks/refs/heads/main/README.md'
    },
    {
      id: 'P-002',
      title: 'GreenRoute',
      team: 'EcoHackers',
      category: 'Sustainability',
      abstract: 'Find routes that minimize carbon footprint using multi-modal transport.',
      members: ['Dana', 'Eve'],
      readmeRawUrl: 'https://raw.githubusercontent.com/electron/electron/refs/heads/main/README.md'
    },
    {
      id: 'P-003',
      title: 'StudyBuddy',
      team: 'LearnersUnited',
      category: 'Education',
      abstract: 'A collaborative study planner with reminders and group challenges.',
      members: ['Frank', 'Grace', 'Heidi'],
      readmeRawUrl: ''
    }
  ]

  // For demo, return a random project
  const randomProject = dummyProjects[Math.floor(Math.random() * dummyProjects.length)]

  return randomProject
})