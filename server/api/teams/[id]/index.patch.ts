import { RenameTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const {
    user: { id: currentUserID },
  } = await requireUserSession(event)

  const id = parseInt(getRouterParam(event, 'id')!)
  const { name } = await readValidatedBody(event, RenameTeamRequest.parse)

  const user = await getUserByID(event, currentUserID)
  if (user?.team_id !== id) {
    throw createError({
      status: 403,
      message: 'Cannot edit other teams',
    })
  }

  await updateTeamName(event, id, name)

  return { message: 'Updated your team' }
})
