import { UpdateUserRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id')!)

  // prefer a non-redirecting session check for API endpoints
  const session = await getUserSession(event)
  if (!session?.user?.id) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'Not authenticated' }
  }
  const userID = session.user.id

  if (id !== userID) {
    throw createError({
      status: 403,
      message: 'Cannot update other users',
    })
  }

  const { name } = await readValidatedBody(event, UpdateUserRequest.parse)

  const user = await getUser(event, id)
  if (!user) {
    await clearUserSession(event)
    throw createError({
      status: 401,
      message: 'Logged in user not found',
    })
  }

  if (name !== undefined) user.name = name

  await updateUser(event, user)

  return { message: 'Your profile is updated' }
})
