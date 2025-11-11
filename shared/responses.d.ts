interface GetUserResponse {
  id: number
  email: string
  name: string | null
  team: {
    id: number
    project_name: string
    project_description: string
    project_demo_url: string | null
    project_repo_url: string | null
  } | null
}

interface CreateTeamResponse {
  message: string
  id: number
}
