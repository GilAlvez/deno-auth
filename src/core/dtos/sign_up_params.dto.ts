import { z } from "zod";

const SignUpParamsSchema = z.object({
  givenName: z.string().min(2).max(100),
  familyName: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8),
})

type SignUpParamsDto = z.infer<typeof SignUpParamsSchema>

export { SignUpParamsSchema };
export type { SignUpParamsDto };

