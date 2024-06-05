import { GoogleApis } from "../../infra/google/google_apis.ts";
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
    private readonly googleApis = new GoogleApis(),
    private readonly jwtService = new JwtService(),
  ) {}

  async execute(params: SignInWithGoogleParamsDto): Promise<string> {
    const { code, redirectUri } = SignInWithGoogleParamsSchema.parse(params);

    const tokens = await this.googleApis.getTokens(code, redirectUri);
    const userInfo = await this.googleApis.getUserInfo(tokens.access_token);
    await this.googleApis.revokeToken(tokens.access_token);
    
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