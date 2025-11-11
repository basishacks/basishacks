import { UpdateTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id')!)
  const payload = await readValidatedBody(event, UpdateTeamRequest.parse)

  await updateTeam(event, { id, ...payload })

  return { message: 'Updated your project' }
})
