import type { H3Event } from 'h3'

function parseFlags(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((s: string) => String(s).trim()).filter(Boolean)
  if (typeof raw === 'string') return raw.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
  return []
}

function stringifyFlags(flags: any): string {
  if (!flags) return ''
  if (Array.isArray(flags)) return flags.map((s: string) => String(s).trim()).filter(Boolean).join('\n')
  return String(flags)
}

export async function getUser(
  event: H3Event,
  userID: number
): Promise<User | null> {
  const row = await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  )
    .bind(userID)
    .first<User>()

  if (!row) return null

  if (row.flags) row.flags = parseFlags(row.flags)
  return row as User
}

export async function getUserByEmail(event: H3Event, email: string) {
  const row = await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  )
    .bind(email)
    .first<User>()

  if (!row) return null
  if (row.flags) row.flags = parseFlags(row.flags)
  return row as User
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
    .first<any>())!

  if (user.flags) user.flags = parseFlags(user.flags)
  return user as User
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
