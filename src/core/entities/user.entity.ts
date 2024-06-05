import { z } from "zod";

const UserSchema = z.object({
  id: z.string().length(24),
  uuid: z.string().uuid(),
  identifier: z.record(z.string()).optional(),
  givenName: z.string().trim().min(2).max(100),
  familyName: z.string().trim().min(2).max(255),
  email: z.string().trim().email(),
  password: z.string().trim().min(8).optional(),
  oauth: z.object({
    google: z.object({ 
      id: z.string()
    }).optional(),
  }).optional(),
  locale: z.string().trim().optional(),
  imageUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

type User = z.infer<typeof UserSchema>

export { UserSchema };
export type { User };

