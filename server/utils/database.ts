import type { H3Event } from 'h3'

export async function getHackathon(event: H3Event): Promise<Hackathon | null> {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM hackathon'
  ).first<Hackathon>()
}

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

export async function getTeamByID(event: H3Event, teamID: number) {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM teams WHERE id = ?'
  )
    .bind(teamID)
    .first<Team>()
}
