import { z } from "zod";

const SignInWithGoogleParamsSchema = z.object({
  code: z.string().trim().min(1),
  redirectUri: z.string().trim().url(),
})

type SignInWithGoogleParamsDto = z.infer<typeof SignInWithGoogleParamsSchema>

export { SignInWithGoogleParamsSchema };
export type { SignInWithGoogleParamsDto };

