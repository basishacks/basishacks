import type { H3Event } from 'h3'

function parseFlags(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((s: string) => String(s).trim()).filter(Boolean)
  if (typeof raw === 'string') {
    return raw.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
  }
  return []
}

function stringifyFlags(flags: any): string {
  if (!flags) return ''
  if (Array.isArray(flags)) return flags.map((s: string) => String(s).trim()).filter(Boolean).join('\n')
  return String(flags)
}

export async function getTeam(event: H3Event, teamID: number) {
  const row = await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM teams WHERE id = ?'
  )
    .bind(teamID)
    .first<any>()

  if (!row) return null

  // flags stored in DB as newline-separated text; convert to string[]
  row.flags = parseFlags(row.flags)

  return row as Team
}

export async function createTeam(event: H3Event, teamName: string) {
  const team = (await event.context.cloudflare.env.DB.prepare(
    'INSERT INTO teams(name) VALUES(?) RETURNING *'
  )
    .bind(teamName)
    .first<any>())!

  // return team object with parsed flags array
  team.flags = parseFlags(team.flags)
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
  stringifyFlags(team.flags),
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
