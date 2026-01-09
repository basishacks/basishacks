import { CreateTeamQuery, CreateTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  // prefer a non-redirecting session check for API endpoints
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'Not authenticated' }
  }
  const userID = session.user.id

  const user = await getUser(event, userID)
  if (!user) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'Logged in user not found' }
  }
  if (user?.team_id) {
    throw createError({
      status: 403,
      message: 'Cannot create a team while in a team',
    })
  }

  const { add = false } = await getValidatedQuery(event, CreateTeamQuery.parse)
  const { name } = await readValidatedBody(event, CreateTeamRequest.parse)

  if (name.length > 30) {
    throw createError({
      status: 400,
      message: 'Team name cannot exceed 50 characters',
    })
  }

  const team = await createTeam(event, name)
  if (add) {
    await addTeamMember(event, team.id, userID)
  }

  return convertTeamToPublic(team)
})
