import { CreateTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const {
    user: { id: userID },
  } = await requireUserSession(event)

  const { name } = await readValidatedBody(event, CreateTeamRequest.parse)

  const teamID = await createTeam(event, name, userID)

  return {
    message: 'Your team was created',
    id: teamID,
  }
})
