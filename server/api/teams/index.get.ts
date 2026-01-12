export default defineEventHandler(async (event) => {
  await requireJudge(event)

  const teams = await getSubmittedTeams(event)

  return teams.map(convertTeamToPublic)
})
