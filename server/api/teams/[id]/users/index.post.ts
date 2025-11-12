import { AddTeamUserRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const {
    user: { id: currentUserID },
  } = await requireUserSession(event)

  const { email } = await readValidatedBody(event, AddTeamUserRequest.parse)

  const teamID = parseInt(getRouterParam(event, 'id')!)

  const user = await getUserByID(event, currentUserID)
  if (user?.team_id !== teamID) {
    throw createError({
      status: 403,
      message: 'Cannot add members to other teams',
    })
  }

  await addUserToTeamWithEmail(event, teamID, email)

  return { message: 'Added user to the team' }
})
