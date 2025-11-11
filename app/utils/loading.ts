export async function withLoadingIndicator(func: () => unknown) {
  const loadingIndicator = useLoadingIndicator()
  loadingIndicator.start()
  try {
    await func()
  } catch (e) {
    loadingIndicator.finish({ error: true })
    throw e
  }
  loadingIndicator.finish()
}
