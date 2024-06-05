import { z } from "zod";
import { UserSchema } from "../entities/user.entity.ts";

const SignUpWithEmailParamsSchema = z.object({
  givenName: UserSchema.shape.givenName,
  familyName: UserSchema.shape.familyName,
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
})

type SignUpWithEmailParamsDto = z.infer<typeof SignUpWithEmailParamsSchema>

export { SignUpWithEmailParamsSchema };
export type { SignUpWithEmailParamsDto };

