import type { H3Event } from 'h3'

export async function getUser(
  event: H3Event,
  userID: number
): Promise<User | null> {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  )
    .bind(userID)
    .first<User>()
}

export async function getUserByEmail(event: H3Event, email: string) {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  )
    .bind(email)
    .first<User>()
}

export async function addCodeToUser(event: H3Event, email: string) {
  const oldUser = await getUserByEmail(event, email)
  if (
    oldUser?.login_expiry &&
    oldUser.login_expiry > Date.now() - 1 * 60 * 1000
  ) {
    throw createError({
      status: 403,
      message: 'Please wait 1 minute before requesting another code!',
    })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = Date.now() + 10 * 60 * 1000

  // upsert user
  const user = (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO users(email, login_code, login_expiry) VALUES(?, ?, ?) ON CONFLICT(email) DO UPDATE SET login_code = EXCLUDED.login_code, login_expiry = EXCLUDED.login_expiry RETURNING *'
  )
    .bind(email, code, expiry)
    .first<User>())!

  return user
}

export async function getUserByCode(
  event: H3Event,
  email: string,
  code: string
) {
  return await event.context.cloudflare.env.DB.prepare(
    'UPDATE users SET login_code = NULL WHERE email = ? AND login_code = ? RETURNING id'
  )
    .bind(email, code)
    .first<Pick<User, 'id'>>()
}

export async function updateUser(event: H3Event, user: User) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE users SET name = ? WHERE id = ?'
  )
    .bind(user.name, user.id)
    .run()

  if (!result.meta.changed_db) {
    throw createError({
      status: 404,
      message: 'User not found',
    })
  }
}
