import { getUserByEmailCode } from '~~/server/utils/database'
import { LoginRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const { email, code } = await readValidatedBody(event, LoginRequest.parse)

  const user = await getUserByEmailCode(event, email, code)
  if (!user) {
    throw createError({
      status: 400,
      message: 'The given email & code combination is incorrect',
    })
  }

  await setUserSession(event, {
    user: { id: user.id },
  })

  return { message: 'You are logged in!' }
})
