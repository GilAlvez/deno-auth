import ky, { HTTPError } from "ky";
import qs from "qs";
import { GoogleApisError } from "../../core/errors/google_apis_error.ts";
import { env } from "../../env.ts";

interface IGoogleTokens {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: "Bearer";
}

interface IGoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export class GoogleApis {
  async getTokens(code: string, redirectUri: string): Promise<IGoogleTokens> {
    try {
      const response = await ky.post("https://oauth2.googleapis.com/token", {
        body: qs.stringify({
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      console.log("RESPONSE tokens", response);
  
      return await response.json(); 
    } catch (e ) {
      if (e instanceof HTTPError) {
        const body = await e.response.json()
        console.error("GoogleApis.getTokens", body)
      } 
      throw new GoogleApisError("Unable to get Google tokens");
    }
  }

  async revokeToken(token: string): Promise<void> {
    try {
      await ky.post("https://oauth2.googleapis.com/revoke", {
        body: qs.stringify({ token }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    } catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json()
        console.error("GoogleApis.revokeToken", body)
      }
      throw new GoogleApisError("Unable to revoke token");
    }
  }

  async getUserInfo(accessToken: string): Promise<IGoogleUserInfo>  {
    try {
      const response = await ky.get("https://www.googleapis.com/userinfo/v2/me", {
        headers: { "Authorization": `Bearer ${accessToken}` },
      });
  
      return await response.json()
    } catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json()
        console.error("GoogleApis.getUserInfo", body)
      }
      throw new GoogleApisError("Unable to Google get user info");
    }
  }
}