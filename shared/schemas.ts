import z from 'zod'

const BasisEmail = z
  .email()
  .refine(
    (s) => s.toLowerCase().endsWith('@basischina.com'),
    'Please use a @basischina.com email'
  )

const TeamName = z.string().min(2, 'Team name must be at least 2 characters')

const BooleanString = z
  .literal(['true', 'false'])
  .transform((s) => s === 'true')

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
  add: BooleanString.optional(),
})
export type CreateTeamQuery = z.infer<typeof CreateTeamQuery>

export const CreateTeamRequest = z.object({
  name: TeamName.max(30, 'Team name cannot exceed 30 characters'),
})
export type CreateTeamRequest = z.infer<typeof CreateTeamRequest>

export const UpdateTeamRequest = z.object({
  name: z.optional(TeamName.max(30, 'Team name cannot exceed 30 characters')),
  final: z.optional(z.boolean()),
  project: z.optional(
    z.object({
      name: z.optional(z.string().max(50, 'Project name cannot exceed 50 characters')),
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
