export default defineEventHandler(async (event) => {
  const teamID = parseInt(getRouterParam(event, 'id')!)
  const userID = parseInt(getRouterParam(event, 'user')!)

  const {
    user: { id: currentUserID },
  } = await requireUserSession(event)

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
