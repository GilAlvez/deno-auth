import { hash } from "bcrypt";
import { sign } from 'hono/jwt';
import { env } from "../../env.ts";
import { UsersRepository } from "../../infra/repositories/users.repository.ts";
import { SignUpWithEmailParamsDto, SignUpWithEmailParamsSchema } from "../dtos/sign_up_with_email_params.dto.ts";
import { ResourceConflict } from "../errors/resource_conflict.ts";

export interface ISignUpWithEmailUseCase  {
  execute(params: SignUpWithEmailParamsDto): Promise<string>;
}

export class SignUpWithEmailUseCase implements ISignUpWithEmailUseCase {
  constructor(private readonly usersRepository: UsersRepository = new UsersRepository()) {

  }
  async execute(params: SignUpWithEmailParamsDto): Promise<string> {
    const validParams = SignUpWithEmailParamsSchema.parse(params);

    const emailExists = await this.usersRepository.findUnique("email", validParams.email);
    if (emailExists) throw new ResourceConflict("Email already exists");

    const hashedPassword = await hash(validParams.password);

    const user = await this.usersRepository.create({
      givenName: validParams.givenName,
      familyName: validParams.familyName,
      email: validParams.email,
      password: hashedPassword,
    });

    const accessToken = await sign({
        sub: user?.uuid,
        name: `${user?.givenName} ${user?.familyName}`,
        email: user?.email,
      }, 
      env.JWT_SECRET,
    )
    return accessToken
  }
}