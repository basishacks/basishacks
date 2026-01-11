import { AddTeamMemberRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const teamID = parseInt(getRouterParam(event, 'id')!)

  const {
    user: { id: currentUserID },
  } = await requireUserSession(event)

  const currentUser = await getUser(event, currentUserID)
  if (currentUser?.team_id !== teamID) {
    throw createError({
      status: 403,
      message: 'Cannot add members to other teams',
    })
  }

  const { email } = await readValidatedBody(event, AddTeamMemberRequest.parse)

  const user = await getUserByEmail(event, email)
  if (!user) {
    throw createError({
      status: 404,
      message: 'User not found',
    })
  }

  await addTeamMember(event, teamID, user.id)

  return { message: 'Added user to the team' }
})
