import type { H3Event } from 'h3'

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

export async function updateTeamProject(
  event: H3Event,
  team: Pick<
    Team,
    | 'id'
    | 'project_name'
    | 'project_description'
    | 'project_demo_url'
    | 'project_repo_url'
  >
) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE teams SET project_name = ?, project_description = ?, project_demo_url = ?, project_repo_url = ? WHERE id = ?'
  )
    .bind(
      team.project_name,
      team.project_description,
      team.project_demo_url,
      team.project_repo_url,
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

export async function updateTeamName(
  event: H3Event,
  teamID: number,
  name: string
) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE teams SET name = ? WHERE id = ?'
  )
    .bind(name, teamID)
    .run()
  if (!result.meta.changed_db) {
    throw createError({
      status: 404,
      message: 'Team not found',
    })
  }
}

export async function getTeamUsers(event: H3Event, teamID: number) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM users WHERE team_id = ?'
  )
    .bind(teamID)
    .all<User>()
  return result.results
}

export async function removeUserFromTeam(
  event: H3Event,
  teamID: number,
  userID: number
) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE users SET team_id = NULL WHERE id = ? AND team_id = ?'
  )
    .bind(userID, teamID)
    .run()

  if (!result.meta.changed_db) {
    throw createError({
      status: 404,
      message: 'User not found or not in team',
    })
  }
}

export async function addUserToTeamWithEmail(
  event: H3Event,
  teamID: number,
  userEmail: string
) {
  const result = await event.context.cloudflare.env.DB.prepare(
    'UPDATE users SET team_id = ? WHERE email = ? AND team_id IS NULL'
  )
    .bind(teamID, userEmail)
    .run()

  if (!result.meta.changed_db) {
    throw createError({
      status: 404,
      message: 'User not found or already in a team',
    })
  }
}
