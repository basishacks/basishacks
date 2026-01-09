import { AddTeamMemberRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const teamID = parseInt(getRouterParam(event, 'id')!)

  const team = await getTeam(event, teamID)

  if (team?.flags.includes("team.disable.addTeammate")){
    throw createError({
      status: 403,
      message: 'No permission to add team members to this team',
    })
  }

  // prefer a non-redirecting session check for API endpoints
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'Not authenticated' }
  }
  const currentUserID = session.user.id

  const currentUser = await getUser(event, currentUserID)
  if (currentUser?.team_id !== teamID) {
    throw createError({
      status: 403,
      message: 'Cannot add members to other teams',
    })
  }

  const { email } = await readValidatedBody(event, AddTeamMemberRequest.parse)

  const user = await getUserByEmail(event, email)
  if (!user) {
    throw createError({
      status: 404,
      message: 'User not found',
    })
  }

  await addTeamMember(event, teamID, user.id)

  return { message: 'Added user to the team' }
})
