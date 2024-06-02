import { z } from "zod";

const SignUpWithEmailParamsSchema = z.object({
  givenName: z.string().trim().min(2).max(100),
  familyName: z.string().trim().min(2).max(255),
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
})

type SignUpWithEmailParamsDto = z.infer<typeof SignUpWithEmailParamsSchema>

export { SignUpWithEmailParamsSchema };
export type { SignUpWithEmailParamsDto };

