import { compare } from "bcrypt";
import { sign } from "jsr:@hono/hono@^4.4.0/jwt";
import { env } from "../../env.ts";
import { UsersRepository } from "../../infra/repositories/users.repository.ts";
import { SignInWithEmailParamsDto, SignInWithEmailParamsSchema } from "../dtos/sign_in_with_email_params.dto.ts";
import { InvalidFlow } from "../errors/invalid_flow.ts";
import { Unauthorized } from "../errors/unauthorized.ts";

export interface ISignInWithEmailUseCase {
  execute(params: SignInWithEmailParamsDto): Promise<string>
}

export class SignInWithEmailUseCase implements ISignInWithEmailUseCase {
  constructor(private readonly usersRepository: UsersRepository = new UsersRepository()) {}

  async execute(params: SignInWithEmailParamsDto): Promise<string> {
    const validParams = SignInWithEmailParamsSchema.parse(params);

    const user = await this.usersRepository.findUnique("email", validParams.email)

    if (!user) throw new Unauthorized("Invalid credentials");
    if (!user.password) throw new InvalidFlow("This user cannot sign in with email and password");

    const isValidPassword = await compare(validParams.password, user.password)

    if (!isValidPassword) throw new Unauthorized("Invalid credentials");

    const accessToken = await sign({
        sub: user.uuid,
        name: `${user.givenName} ${user.familyName}`,
        email: user.email,
      }, 
      env.JWT_SECRET,
    )

    return accessToken
  }
}