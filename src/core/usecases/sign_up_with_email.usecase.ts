import { hash } from "bcrypt";
import { UsersRepository } from "../../infra/repositories/users.repository.ts";
import { JwtService } from "../../services/jwt.service.ts";
import { SignUpWithEmailParamsDto, SignUpWithEmailParamsSchema } from "../dtos/sign_up_with_email_params.dto.ts";
import { ResourceConflict } from "../errors/resource_conflict.ts";
import { Unauthorized } from "../errors/unauthorized.ts";

export interface ISignUpWithEmailUseCase  {
  execute(params: SignUpWithEmailParamsDto): Promise<string>;
}

export class SignUpWithEmailUseCase implements ISignUpWithEmailUseCase {
  constructor(
    private readonly usersRepository: UsersRepository = new UsersRepository(),
    private readonly jwtService = new JwtService(),
  ) {}
  
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

    if (!user) throw new Unauthorized("Invalid credentials");
    
    return await this.jwtService.generateAccessToken(user)
  }
}