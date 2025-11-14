export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id')!)

  const user = await getUser(event, id)
  if (!user) {
    throw createError({
      status: 404,
      message: 'User not found',
    })
  }
  const team = user.team_id ? await getTeam(event, user.team_id) : null

  return {
    ...convertUserToPublic(user),
    team: team && convertTeamToPublic(team),
  } satisfies GetUserResponse
})
