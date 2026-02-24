import type { H3Event } from 'h3'

export async function createTeamScores(
  event: H3Event,
  scores: Pick<TeamScores, 'team_id' | 'judge_user_id' | 'scores' | 'reasoning'>
) {
  return (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO team_scores(team_id, judge_user_id, reasoning, scores) VALUES(?, ?, ?) RETURNING *'
  )
    .bind(scores.team_id, scores.judge_user_id, scores.reasoning, scores.scores)
    .first<TeamScores>())!
}
