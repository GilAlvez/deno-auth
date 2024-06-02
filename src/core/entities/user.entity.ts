import { z } from "zod";

const UserSchema = z.object({
  id: z.string().length(24),
  uuid: z.string().uuid(),
  givenName: z.string().trim().min(2).max(100),
  familyName: z.string().trim().min(2).max(255),
  email: z.string().trim(),
  password: z.string().trim().min(8).optional(),
  oauth: z.object({
    google: z.object({ 
      id: z.string()
    }).optional(),
  }).optional(),
  imageUrl: z.string().url().optional(),
  identifier: z.record(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

type User = z.infer<typeof UserSchema>

export { UserSchema };
export type { User };

