import { SignInWithGoogleParamsDto } from "../../core/dtos/sign_in_with_google_params.dto.ts";
import { GoogleApis } from "../google/google_apis.ts";

export class OAuth2Repository {
  constructor(private readonly googleApis: GoogleApis = new GoogleApis()) {}

  async getGoogleUserInfo({ code, redirectUri }: SignInWithGoogleParamsDto) {
    const tokens = await this.googleApis.getTokens(code, redirectUri);
    const userInfo = await this.googleApis.getUserInfo(tokens.access_token);
    await this.googleApis.revokeToken(tokens.access_token);
    return userInfo;
  }

  // TODO: Sign In With Apple
}
