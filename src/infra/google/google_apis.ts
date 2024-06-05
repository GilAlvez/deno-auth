import ky from "ky";
import qs from "qs";
import { env } from "../../env.ts";

export class GoogleApis {
  static async getTokens(code: string, redirectUri: string): Promise<Record<string, unknown>> {
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

    return await response.json<Record<string, unknown>>();
  }

  static async revokeToken(token: string): Promise<void> {
    await ky.post("https://oauth2.googleapis.com/revoke", {
      body: qs.stringify({ token }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
  }

  static async getUserInfo(accessToken: string): Promise<Record<string, unknown>>  {
    const response = await ky.get("https://www.googleapis.com/userinfo/v2/me", {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });

    return await response.json<Record<string, unknown>>()
  }
}