import z from 'zod'

const BasisEmail = z
  .email()
  .refine(
    (s) => s.toLowerCase().endsWith('@basischina.com'),
    'Please use your @basischina.com email'
  )

export const SendCodeRequest = z.object({
  email: BasisEmail,
})
export type SendCodeRequest = z.infer<typeof SendCodeRequest>

export const LoginRequest = z.object({
  email: BasisEmail,
  code: z.string(),
})
export type LoginRequest = z.infer<typeof LoginRequest>

export const CreateTeamRequest = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
})
export type CreateTeamRequest = z.infer<typeof CreateTeamRequest>
