import type { H3Event } from 'h3'

export async function getTeam(event: H3Event, teamID: number) {
  return await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM teams WHERE id = ?'
  )
    .bind(teamID)
    .first<Team>()
}

export async function createTeam(event: H3Event, teamName: string) {
  const team = (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO teams(name) VALUES(?) RETURNING *'
  )
    .bind(teamName)
    .first<Team>())!
  return team
}

export async function updateTeam(event: H3Event, team: Team) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE teams SET name = ?, project_name = ?, project_description = ?, project_demo_url = ?, project_repo_url = ?, project_submitted = ? WHERE id = ?'
  )
    .bind(
      team.name,
      team.project_name,
      team.project_description,
      team.project_demo_url,
      team.project_repo_url,
      team.project_submitted,
      team.id
    )
    .run()
  if (!result.meta.changed_db) {
    throw createError({
      status: 404,
      message: 'Team not found',
    })
  }
}
