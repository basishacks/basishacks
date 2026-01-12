export function convertUserToPublic(user: User): APIUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    team_id: user.team_id,
  }
}

export function convertTeamToPublic(team: Team): APITeam {
  return {
    id: team.id,
    name: team.name,
    project: {
      name: team.project_name,
      description: team.project_description,
      demo_url: team.project_demo_url,
      repo_url: team.project_repo_url,
      submitted: team.project_submitted ? true : false,
    },
  }
}
