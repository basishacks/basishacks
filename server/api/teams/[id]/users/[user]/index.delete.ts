export default defineEventHandler(async (event) => {
  const teamID = parseInt(getRouterParam(event, 'id')!)
  const userID = parseInt(getRouterParam(event, 'user')!)

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
      message: 'Cannot remove members of other teams',
    })
  }

  await removeTeamMember(event, teamID, userID)

  return { message: 'Removed user from the team' }
})
