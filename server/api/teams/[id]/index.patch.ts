import { UpdateTeamRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id')!)

  const {
    user: { id: userID },
  } = await requireUserSession(event)

  const user = await getUser(event, userID)
  if (user?.team_id !== id) {
    throw createError({
      status: 403,
      message: 'Cannot edit other teams',
    })
  }

  const payload = await readValidatedBody(event, UpdateTeamRequest.parse)

  const team = await getTeam(event, id)
  if (!team) {
    throw createError({
      status: 404,
      message: 'Team not found',
    })
  }

  if (payload.name !== undefined) team.name = payload.name
  if (payload.project?.name !== undefined)
    team.project_name = payload.project.name
  if (payload.project?.description !== undefined)
    team.project_description = payload.project.description
  if (payload.project?.demo_url !== undefined)
    team.project_demo_url = payload.project.demo_url
  if (payload.project?.repo_url !== undefined)
    team.project_repo_url = payload.project.repo_url

  await updateTeam(event, team)

  return { message: 'Updated your team & project' }
})
