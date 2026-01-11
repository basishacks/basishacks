type HackathonStatus =
  | 'not_started' // before the event
  | 'in_progress' // during the event
  | 'voting' // after the event, peer voting
  | 'finished' // event completed
  | 'paused' // event paused for maintenance, etc.

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
  project_name: string
  project_description: string
  project_demo_url: string | null
  project_repo_url: string | null
  project_submitted: number
  flags: Array<string> // New field: flags seperated in newlines
}

interface User {
  id: number
  email: string
  name: string | null
  team_id: number | null
  login_code: string | null
  login_expiry: number | null
  flags: Array<string>
}
