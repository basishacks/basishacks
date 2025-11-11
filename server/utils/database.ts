export async function getHackathon(): Promise<Hackathon | null> {
  const event = useEvent()
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM hackathon'
  ).first<Hackathon>()
}
