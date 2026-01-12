// this file should contain the types exactly as defined in the database.

type HackathonStatus =
  | 'not_started' // before the event
  | 'in_progress' // during the event
  | 'voting' // after the event, peer voting
  | 'finished' // event completed
  | 'paused' // event paused for maintenance, etc.

type UserRole = 'participant' | 'judge' | 'admin'

type TeamPathway = 'junior' | 'senior'

interface Hackathon {
  id: 1 // lol
  status: HackathonStatus
  start_timestamp: number
  end_timestamp: number
  voting_start_timestamp: number
  voting_end_timestamp: number
  results_open_timestamp: number
  theme_name: string | null
  theme_description: string | null
}

interface Team {
  id: number
  name: string
  pathway: TeamPathway | null
  project_name: string
  project_description: string
  project_demo_url: string | null
  project_repo_url: string | null
  project_submitted: number
}

interface TeamScores {
  id: number
  team_id: number
  judge_user_id: number
  scores: string
}

interface User {
  id: number
  email: string
  role: UserRole
  name: string | null
  team_id: number | null
  login_code: string | null
  login_expiry: number | null
}

interface Ballot {
  id: number
  user_id: number
  projects: string
  scores: string | null
  reasoning: string | null
}
