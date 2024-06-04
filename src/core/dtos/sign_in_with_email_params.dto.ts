import { z } from "zod";

const SignInWithEmailParamsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
})

type SignInWithEmailParamsDto = z.infer<typeof SignInWithEmailParamsSchema>

export { SignInWithEmailParamsSchema };
export type { SignInWithEmailParamsDto };

