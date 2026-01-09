import type { H3Event } from 'h3'

export async function getTeam(event: H3Event, teamID: number) {
  const row = await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM teams WHERE id = ?'
  )
    .bind(teamID)
    .first<any>()

  if (!row) return null

  // flags stored in DB as newline-separated text; convert to string[]
  if (typeof row.flags === 'string') {
    row.flags = row.flags
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
  }

  return row as Team
}

export async function createTeam(event: H3Event, teamName: string) {
  const team = (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO teams(name) VALUES(?) RETURNING *'
  )
    .bind(teamName)
    .first<any>())!

  // convert flags to string[] if needed
  if (typeof team.flags === 'string') {
    team.flags = team.flags.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
  }

  return team as Team
}

export async function updateTeam(event: H3Event, team: Team) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE teams SET name = ?, project_name = ?, project_description = ?, project_demo_url = ?, project_repo_url = ?, project_submitted = ?, flags = ? WHERE id = ?'
  )
    .bind(
      team.name,
      team.project_name,
      team.project_description,
      team.project_demo_url,
      team.project_repo_url,
      team.project_submitted,
      // flags should be stored as newline-separated string in DB
      Array.isArray(team.flags) ? team.flags.join('\n') : team.flags,
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
