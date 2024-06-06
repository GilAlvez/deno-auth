import { OAuth2Repository } from "../../infra/repositories/oauth2.repository.ts";
import { UsersRepository } from "../../infra/repositories/users.repository.ts";
import { JwtService } from "../../services/jwt.service.ts";
import { SignInWithGoogleParamsDto, SignInWithGoogleParamsSchema } from "../dtos/sign_in_with_google_params.dto.ts";
import { Unauthorized } from "../errors/unauthorized.ts";

export interface ISignInWithGoogleUseCase {
  execute(params: SignInWithGoogleParamsDto): Promise<string>
}

export class SignInWithGoogleUseCase implements ISignInWithGoogleUseCase {
  constructor(
    private readonly usersRepository: UsersRepository = new UsersRepository(),
    private readonly oAuth2Repository = new OAuth2Repository(),
    private readonly jwtService = new JwtService(),
  ) {}

  async execute(params: SignInWithGoogleParamsDto): Promise<string> {
    const validParams = SignInWithGoogleParamsSchema.parse(params);

    const userInfo = await this.oAuth2Repository.getGoogleUserInfo(validParams);

    if (!userInfo.verified_email) throw new Unauthorized("Google account is not verified")

    let user = await this.usersRepository.findUnique("email", userInfo.email)

    if (!user) {
      user = await this.usersRepository.create({
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
        email: userInfo.email,
        oauth: {
          google: { id: userInfo.id }
        },
      })
      if (!user) throw new Unauthorized("User cannot be created")
    } 

    if (!user?.oauth?.google?.id) {
      throw new Unauthorized("Account found but not linked to Google")
    }

    return await this.jwtService.generateAccessToken(user)
  }
}