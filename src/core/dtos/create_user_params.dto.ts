import { z } from "zod";
import { UserSchema } from "../entities/user.entity.ts";

const CreateUserParamsSchema = z.object({
  uuid: UserSchema.shape.uuid.optional(),
  identifier: UserSchema.shape.identifier,
  givenName: UserSchema.shape.givenName,
  familyName: UserSchema.shape.familyName,
  email: UserSchema.shape.email,
  password: UserSchema.shape.password,
  oauth: UserSchema.shape.oauth,
  imageUrl: UserSchema.shape.imageUrl,
  locale: UserSchema.shape.locale,
})

type CreateUserParamsDto = z.infer<typeof CreateUserParamsSchema>

export { CreateUserParamsSchema };
export type { CreateUserParamsDto };

