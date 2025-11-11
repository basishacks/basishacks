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
  theme?: HackathonTheme
}

interface HackathonTheme {
  name: string
  description: string
}
