import z from 'zod'

const BasisEmail = z
  .email()
  .refine(
    (s) => s.toLowerCase().endsWith('@basischina.com'),
    'Please use a @basischina.com email'
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

export const UpdateTeamRequest = z.object({
  project_name: z.string(),
  project_description: z.string(),
  project_demo_url: z.union([z.url(), z.literal('')]),
  project_repo_url: z.union([z.url(), z.literal('')]),
})
export type UpdateTeamRequest = z.infer<typeof UpdateTeamRequest>

export const RenameTeamRequest = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
})
export type RenameTeamRequest = z.infer<typeof RenameTeamRequest>

export const AddTeamUserRequest = z.object({
  email: BasisEmail,
})
export type AddTeamUserRequest = z.infer<typeof AddTeamUserRequest>

export const UpdateUserNameRequest = z.object({
  name: z.string(),
})
export type UpdateUserNameRequest = z.infer<typeof UpdateUserNameRequest>
