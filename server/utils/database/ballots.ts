import type { H3Event } from 'h3'

export async function createBallot(event: H3Event, userID: number) {
  return (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO ballots(user_id) VALUES(?) RETURNING *',
  )
    .bind(userID)
    .first<Ballot>())!
}

export async function getBallotByUser(event: H3Event, userID: number) {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM ballots WHERE user_id = ?',
  )
    .bind(userID)
    .first<Ballot>()
}

export async function updateBallot(event: H3Event, ballot: Ballot) {
  await event.context.cloudflare.env.DB.prepare(
    'UPDATE ballots SET reasoning = ?, submitted = ? WHERE id = ?',
  )
    .bind(ballot.reasoning, ballot.submitted, ballot.id)
    .run()
}

export async function createBallotScore(
  event: H3Event,
  ballotID: number,
  projectID: number,
) {
  return (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO ballot_scores(ballot_id, project_id) VALUES(?, ?) RETURNING *',
  )
    .bind(ballotID, projectID)
    .first<BallotScore>())!
}

export async function getBallotScores(event: H3Event, ballotID: number) {
  return (
    await event.context.cloudflare.env.DB.prepare(
      'SELECT * FROM ballot_scores WHERE ballot_id = ?',
    )
      .bind(ballotID)
      .all<BallotScore>()
  ).results
}

export async function updateBallotScore(event: H3Event, score: BallotScore) {
  await event.context.cloudflare.env.DB.prepare(
    'UPDATE ballot_scores SET score = ? WHERE id = ?',
  )
    .bind(score.score, score.id)
    .run()
}
