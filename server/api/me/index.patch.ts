import { UpdateUserNameRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const { name } = await readValidatedBody(event, UpdateUserNameRequest.parse)

  await setUserName(event, user.id, name)

  return { message: 'Your name is updated' }
})
