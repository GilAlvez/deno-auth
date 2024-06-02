import { hash } from "bcrypt";
import { UsersRepository } from "../../data/repositories/users.repository.ts";
import { SignUpParamsDto } from "../dtos/sign_up_params.dto.ts";

export interface ISignUpUseCase  {
  execute(params: SignUpParamsDto): Promise<string>;
}

export class SignUpUseCase implements ISignUpUseCase {
  constructor(private readonly usersRepository: UsersRepository) {

  }
  async execute(params: SignUpParamsDto): Promise<string> {
    const emailExists = await this.usersRepository.findUnique("email", params.email);

    if (emailExists) throw new Error("Email already exists"); // TODO: Custom Error

    const hashedPassword = await hash(params.email);

    const user = await this.usersRepository.create({
      givenName: params.givenName,
      familyName: params.familyName,
      email: params.email,
      password: hashedPassword,
    });

    console.log(user)

    // TODO: Generate JWT Token
    const accessToken = "JWT"
    return accessToken
  }
}