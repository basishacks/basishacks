export default defineEventHandler(async (event) => {
  const hackathon = await event.context.cloudflare.env.DB.prepare(
    'SELECT * FROM hackathon'
  ).first<Hackathon>()

  if (!hackathon) {
    throw createError({
      statusCode: 404,
      message: 'No hackathon found',
    })
  }

  return hackathon
})
