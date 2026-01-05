export default defineEventHandler((event) => {
  // Ensure API routes return JSON for errors / content negotiation.
  // Some auth helpers redirect or the global error handler emits HTML when
  // the Accept header prefers HTML. Force the request Accept to application/json
  // for server routes under /api so errors are returned as JSON.
  try {
    const rawUrl = event.node.req.url || ''
    const url = new URL(rawUrl, 'http://localhost')
    if (url.pathname.startsWith('/api/')) {
      const headers = (event.node.req.headers as Record<string, string | undefined>) || {}
      headers['accept'] = 'application/json'
      // also advise responses to be JSON by default
      event.node.res.setHeader?.('content-type', 'application/json; charset=utf-8')
    }
  } catch (err) {
    // non-blocking: if we can't parse URL or set headers, continue
  }
})
