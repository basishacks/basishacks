interface GetUserResponse {
  id: number
  email: string
  name: string | null
  team: {
    id: number
    name: string
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

type GetTeamUsersResponse = {
  id: number
  email: string
  name: string | null
  team_id: number | null
}[]
