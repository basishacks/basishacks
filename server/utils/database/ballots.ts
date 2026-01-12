import type { H3Event } from 'h3'

export async function createBallot(
  event: H3Event,
  userID: number,
  projects: number[]
) {
  return (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO ballots(user_id, projects) VALUES(?, ?) RETURNING *'
  )
    .bind(userID, JSON.stringify(projects))
    .first<Ballot>())!
}

export async function getBallotByUser(event: H3Event, userID: number) {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM ballots WHERE user_id = ?'
  )
    .bind(userID)
    .first<Ballot>()
}

export async function updateBallotScores(event: H3Event, ballot: Ballot) {
  await event.context.cloudflare.env.DB.prepare(
    'UPDATE ballots SET scores = ? WHERE id = ?'
  )
    .bind(ballot.scores, ballot.id)
    .run()
}
