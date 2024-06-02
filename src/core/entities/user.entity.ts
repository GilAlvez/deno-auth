import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  uuid: z.string().uuid(),
  givenName: z.string(),
  familyName: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  oauth: z.object({
    google: z.object({ 
      id: z.string() 
    }).optional(),
  }),
  imageUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

type User = z.infer<typeof UserSchema>

export { UserSchema };
export type { User };

