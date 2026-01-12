export default defineEventHandler(async (event) => {
  const { id: userID } = await requireJudge(event)

  const teams = await getSubmittedUnjudgedTeams(event, userID)

  return teams.map(convertTeamToPublic)
})
