export default defineEventHandler(async () => {
  const hackathon = await getHackathon()

  if (!hackathon) {
    throw createError({
      statusCode: 404,
      message: 'No hackathon found',
    })
  }

  return hackathon
})
