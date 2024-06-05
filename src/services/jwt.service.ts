import { sign } from "hono/jwt";
import { User } from "../core/entities/user.entity.ts";
import { env } from "./../env.ts";

export class JwtService {
  async generateAccessToken(user: User): Promise<string> {
    return await sign({
        sub: user.uuid,
        name: `${user.givenName} ${user.familyName}`,
        email: user.email,
      }, 
      env.JWT_SECRET,
    )
  }
}