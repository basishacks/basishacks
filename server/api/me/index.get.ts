export default defineEventHandler(async (event) => {
  const {
    user: { id: userID },
  } = await requireUserSession(event)

  const user = await getUserByID(event, userID)
  if (!user) {
    await clearUserSession(event)
    throw createError({
      status: 403,
      message: 'The user was deleted',
    })
  }
  const team = await getTeamByID(event, user.team_id)
  if (!team) {
    await clearUserSession(event)
    throw createError({
      status: 403,
      message: 'The team was deleted',
    })
  }

  return {
    id: user.id,
    email: user.email,
    team: {
      id: team.id,
      project_name: team.project_name,
      project_description: team.project_description,
      project_demo_url: team.project_demo_url,
      project_repo_url: team.project_repo_url,
    },
  }
})
