declare module 'h3' {
  interface H3EventContext {
    cf: CfProperties
    cloudflare: {
      request: Request
      env: {
        DB: D1Database
        NUXT_LOGIN_CODE_URL: string
      }
      context: ExecutionContext
    }
  }
}

export default {}
