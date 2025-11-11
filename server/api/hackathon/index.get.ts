export default defineEventHandler(async (event) => {
  const hackathon = await getHackathon(event)

  if (!hackathon) {
    throw createError({
      statusCode: 404,
      message: 'No hackathon found',
    })
  }

  return {
    status: hackathon.status,
    start_timestamp: hackathon.start_timestamp,
    end_timestamp: hackathon.end_timestamp,
    voting_start_timestamp: hackathon.voting_start_timestamp,
    voting_end_timestamp: hackathon.voting_end_timestamp,
    results_open_timestamp: hackathon.results_open_timestamp,
    theme_name: hackathon.theme_name,
    theme_description: hackathon.theme_description,
  }
})
