function parseFlags(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((s: string) => String(s).trim()).filter(Boolean)
  if (typeof raw === 'string') return raw.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
  return []
}

function stringifyFlags(flags: any): string {
  if (!flags) return ''
  if (Array.isArray(flags)) return flags.map((s: string) => String(s).trim()).filter(Boolean).join('\n')
  return String(flags)
}