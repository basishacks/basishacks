export default defineEventHandler(async (event) => {
  // Get the request body
  const body = await readBody(event)

  // Log the submitted verdict for demo purposes
  console.log('Received voting submission:', body)

  // In a real app, you would validate, save to database, etc.
  // For demo, just return success

  return {
    success: true,
    message: 'Verdict submitted successfully',
    projectId: body.projectId || 'unknown'
  }
})