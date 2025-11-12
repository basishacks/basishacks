export default defineEventHandler(async (event) => {
  const {
    user: { id: currentUserID },
  } = await requireUserSession(event)

  const teamID = parseInt(getRouterParam(event, 'id')!)
  const userID = parseInt(getRouterParam(event, 'user')!)

  // if (currentUserID === userID) {
  //   throw createError({
  //     status: 400,
  //     message: 'Cannot remove yourself from the team',
  //   })
  // }

  const currentUser = await getUserByID(event, currentUserID)
  if (currentUser?.team_id !== teamID) {
    throw createError({
      status: 403,
      message: 'Cannot remove members of other teams',
    })
  }

  await removeUserFromTeam(event, teamID, userID)

  return { message: 'Removed user from the team' }
})
