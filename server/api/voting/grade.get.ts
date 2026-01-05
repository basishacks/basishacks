export default defineEventHandler(async (event) => {
  // Prefer a non-redirecting session check for API endpoints
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'Not authenticated' }
  }
  const userID = session.user.id

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

  // For demo, return a random project when open
  const randomProject = dummyProjects[Math.floor(Math.random() * dummyProjects.length)]


  const isOpen = true

  if (!isOpen) {
    return {
      status: 'closed',
      message: 'Voting is not open yet',
    }
  }

  // fetch the full user row and their team (if any) to return public versions
  const user = await getUser(event, userID)
  if (!user) {
    throw createError({ status: 401, message: 'Logged in user not found' })
  }
  const team = user.team_id ? await getTeam(event, user.team_id) : null
  
  if (team.id != -30) {
    setResponseStatus(event, 403)
    return { status: 'error', message: 'Forbidden' }
  }

  return {
    status: 'open',
    project: randomProject,
    team: team.id
  }
})