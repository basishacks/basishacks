import { CreateTeamQuery, CreateTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const {
    user: { id: userID },
  } = await requireUserSession(event)

  const { add = false } = await getValidatedQuery(event, CreateTeamQuery.parse)
  const { name } = await readValidatedBody(event, CreateTeamRequest.parse)

  const team = await createTeam(event, name)
  if (add) {
    await addTeamMember(event, team.id, userID)
  }

  return convertTeamToPublic(team)
})
