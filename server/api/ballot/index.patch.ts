import { updateBallotScores } from '~~/server/utils/database/ballots'
import { SubmitVoteRequest } from '~~/shared/schemas'

export default defineEventHandler(async (event) => {
  const hackathon = await getHackathon(event)
  if (hackathon?.status !== 'voting') {
    throw createError({
      status: 409,
      statusMessage: 'Peer voting is closed',
    })
  }

  const user = await requireUser(event)

  const ballot = await getBallotByUser(event, user.id)
  if (!ballot) {
    throw createError({
      status: 409,
      message: 'No ballot found',
    })
  }

  const payload = await readValidatedBody(event, SubmitVoteRequest.parse)

  ballot.scores = JSON.stringify(payload.scores)
  await updateBallotScores(event, ballot)

  return { message: 'Successfully submitted vote!' }
})
