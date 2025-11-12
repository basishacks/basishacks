export default defineEventHandler(async (event) => {
  const teamID = parseInt(getRouterParam(event, 'id')!)

  const users = await getTeamUsers(event, teamID)

  return users.map(convertUserToPublic) satisfies GetTeamUsersResponse
})
