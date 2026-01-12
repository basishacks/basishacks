export default defineEventHandler(async (event) => {
  const hackathon = await getHackathon(event)
  if (hackathon?.status !== 'voting') {
    throw createError({
      status: 409,
      statusMessage: 'Peer voting is closed',
    })
  }

  const user = await requireUser(event)
  if (!user.team_id) {
    throw createError({
      status: 403,
      statusMessage: 'Only participants can vote',
    })
  }
  const userTeam = await getTeam(event, user.team_id)
  if (!userTeam?.project_submitted) {
    throw createError({
      status: 403,
      statusMessage: 'Only participants with submitted projects can vote',
    })
  }

  let ballot = await getBallotByUser(event, user.id)
  let ballotProjects: Team[] = []
  if (!ballot) {
    // create one
    const projects = await getSubmittedTeams(event)
    const eligibleProjects = projects.filter(
      (p) => p.id !== user.team_id && p.pathway === userTeam.pathway
    )

    if (eligibleProjects.length < 4) {
      throw createError({
        status: 409,
        message: `Not enough projects (${eligibleProjects.length}) to vote on`,
      })
    }

    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * eligibleProjects.length)
      const project = eligibleProjects.splice(index, 1)[0]
      ballotProjects.push(project)
    }

    ballot = await createBallot(
      event,
      user.id,
      ballotProjects.map((p) => p.id)
    )
  } else {
    ballotProjects = await Promise.all(
      JSON.parse(ballot.projects).map((p: number) => getTeam(event, p))
    )
  }

  return {
    id: ballot.id,
    projects: ballotProjects.map((p) => ({
      ...convertTeamToPublic(p).project,
      id: p.id,
    })),
    scores: ballot.scores ? JSON.parse(ballot.scores) : null,
    reasoning: ballot.reasoning,
  } satisfies GetBallotResponse
})
