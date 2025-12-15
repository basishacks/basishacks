import { UpdateTeamRequest } from '~~/shared/schemas'
import { checkProfanity, ProfanityCheckerConfig } from 'glin-profanity';

const config: ProfanityCheckerConfig = {
  languages: ['english', 'spanish', "chinese"],
  severityLevels: true,
  autoReplace: true,
  replaceWith: '***'
};

function updateIfTrue(init: boolean, yon: boolean) {
  if (init) return true;
  return yon;
}

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

  // Judging update 1: We dont want kids uhh doing these.
  // Feel free to remove if unncessecary
  var result = false;
  if (payload.name !== undefined) 
    result = updateIfTrue(result, checkProfanity(payload.name, config).containsProfanity);
  if (payload.project?.name !== undefined) 
    result = updateIfTrue(result, checkProfanity(payload.project?.name, config).containsProfanity);
  if (payload.project?.description !== undefined) 
    result = updateIfTrue(result, checkProfanity(payload.project?.description, config).containsProfanity);
  if (payload.project?.demo_url !== undefined && payload.project?.demo_url !== null) 
    result = updateIfTrue(result, checkProfanity(payload.project?.demo_url, config).containsProfanity);
  if (payload.project?.repo_url !== undefined && payload.project?.repo_url !== null) 
    result = updateIfTrue(result, checkProfanity(payload.project?.repo_url, config).containsProfanity);

  if (result) {
    throw createError({
      status: 400,
      message: 'Inappropriate words found in one or more of your content. Please do not attempt to use inappropriate words.',
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
