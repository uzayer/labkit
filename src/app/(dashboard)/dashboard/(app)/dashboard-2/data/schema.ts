import { z } from 'zod'

const recentActivityStatusSchema = z.enum(['New', 'Delete', 'Invited', 'Suspended'])

export type RecentActivityStatus = z.infer<typeof recentActivityStatusSchema>

const recentActivitySchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  amount: z.number(),
  status: recentActivityStatusSchema,
  createdAt: z.date(),
})

export type RecentActivity = z.infer<typeof recentActivitySchema>

export const recentActivityListSchema = z.array(recentActivitySchema)
