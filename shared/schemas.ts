import z from 'zod'

const BasisEmail = z
  .email()
  .refine(
    (s) => s.toLowerCase().endsWith('@basischina.com'),
    'Please use a @basischina.com email'
  )

const TeamName = z.string().min(2, 'Team name must be at least 2 characters')

export const SendCodeRequest = z.object({
  email: BasisEmail,
})
export type SendCodeRequest = z.infer<typeof SendCodeRequest>

export const LoginRequest = z.object({
  email: BasisEmail,
  code: z.string(),
})
export type LoginRequest = z.infer<typeof LoginRequest>

export const CreateTeamQuery = z.object({
  add: z.optional(z.boolean()),
})
export type CreateTeamQuery = z.infer<typeof CreateTeamQuery>

export const CreateTeamRequest = z.object({
  name: TeamName,
})
export type CreateTeamRequest = z.infer<typeof CreateTeamRequest>

export const UpdateTeamRequest = z.object({
  name: z.optional(TeamName),
  project: z.optional(
    z.object({
      name: z.optional(z.string()),
      description: z.optional(z.string()),
      demo_url: z
        .union([z.url(), z.literal('')])
        .nullish()
        .transform((v) => (v === '' ? null : v)),
      repo_url: z
        .union([z.url(), z.literal('')])
        .nullish()
        .transform((v) => (v === '' ? null : v)),
    })
  ),
})
export type UpdateTeamRequest = z.infer<typeof UpdateTeamRequest>

export const AddTeamMemberRequest = z.object({
  email: BasisEmail,
})
export type AddTeamMemberRequest = z.infer<typeof AddTeamMemberRequest>

export const UpdateUserRequest = z.object({
  name: z.optional(z.string()),
})
export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>
