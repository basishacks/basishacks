import type { H3Event } from 'h3'

// hackathon

export async function getHackathon(event: H3Event): Promise<Hackathon | null> {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM hackathon'
  ).first<Hackathon>()
}

// users

export async function getUserByID(
  event: H3Event,
  userID: number
): Promise<User | null> {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  )
    .bind(userID)
    .first<User>()
}

export async function addCodeToUserWithEmail(event: H3Event, email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = Date.now() + 10 * 60 * 1000

  // upsert user
  const { id } = (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO users(email, login_code, login_expiry) VALUES(?, ?, ?) ON CONFLICT(email) DO UPDATE SET login_code = EXCLUDED.login_code, login_expiry = EXCLUDED.login_expiry RETURNING id'
  )
    .bind(email, code, expiry)
    .first<Pick<User, 'id'>>())!

  return { id, code }
}

export async function getUserByEmailCode(
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

export async function setUserName(
  event: H3Event,
  userID: number,
  name: string
) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE users SET name = ? WHERE id = ?'
  )
    .bind(name, userID)
    .run()
  if (!result.meta.changed_db) {
    throw createError({
      status: 404,
      message: 'User not found',
    })
  }
}

// teams

export async function getTeamByID(event: H3Event, teamID: number) {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM teams WHERE id = ?'
  )
    .bind(teamID)
    .first<Team>()
}

export async function createTeam(
  event: H3Event,
  teamName: string,
  userID: number
) {
  // FIXME: this has race conditions but i cba to solve it
  const { id: teamID } = (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO teams(name) VALUES(?) RETURNING id'
  )
    .bind(teamName)
    .first<Pick<Team, 'id'>>())!
  await event.context.cloudflare.env.DB.prepare(
    'UPDATE users SET team_id = ? WHERE id = ?'
  )
    .bind(teamID, userID)
    .run()
  return teamID
}
