import { CreateTeamQuery, CreateTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  // prefer a non-redirecting session check for API endpoints
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    throw createError({
      status: 401,
      message: 'Logged in user not found',
    })
  }
  const userID = session.user.id

  const user = await getUser(event, userID)
  if (!user) {
    throw createError({
      status: 401,
      message: 'Logged in user not found',
    })
  }
  if (user?.team_id) {
    throw createError({
      status: 403,
      message: 'Cannot create a team while in a team',
    })
  }

  const { add = false } = await getValidatedQuery(event, CreateTeamQuery.parse)
  const { name } = await readValidatedBody(event, CreateTeamRequest.parse)

  const team = await createTeam(event, name)
  if (add) {
    await addTeamMember(event, team.id, userID)
  }

  return convertTeamToPublic(team)
})
