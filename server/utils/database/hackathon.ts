import type { H3Event } from 'h3'

export async function getHackathon(event: H3Event): Promise<Hackathon | null> {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM hackathon'
  ).first<Hackathon>()
}
