export function convertUserToPublic(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    team_id: user.team_id,
  }
}
