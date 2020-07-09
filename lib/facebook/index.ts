import { FacebookConfig, FacebookUser } from "./interfaces";
import { Request, Response } from "express";
import querystring from "querystring";
import axios from "axios";

export default class FacebookProvider {
  private params: FacebookConfig;

  constructor(data: FacebookConfig) {
    if (!data.clientId) {
      throw new Error("Missing clientId parameter.");
    }

    if (!data.redirectUri) {
      throw new Error("Missing redirectUri parameter.");
    }

    this.params = {
      clientId: data.clientId,
      doneCallback: data.doneCallback,
      clientSecret: data.clientSecret,
      redirectUri: data.redirectUri,
      scope: data.scope ?? ["email"].join(","),
      responseType: data.responseType ?? "code",
      authType: data.authType ?? "rerequest",
      display: data.display ?? "popup",
      searchParams: data.searchParams ?? ["email", "name", "picture"].join(","),
    };

    this.route = this.route.bind(this);
    this.responseRoute = this.responseRoute.bind(this);
    this.buildUser = this.buildUser.bind(this);
  }

  private async getAppToken() {
    const { clientId, clientSecret } = this.params;
    const {
      data: { access_token },
    } = await axios.get(
      `https://graph.facebook.com/v7.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    );
    this.params.appToken = access_token;
  }

  private async getUserId(accessToken: string) {
    const { searchParams } = this.params;
    const debugToken = querystring.stringify({
      access_token: accessToken,
      fields: searchParams,
      state: "authStep",
    });

    return await axios.get(`https://graph.facebook.com/me?${debugToken}`);
  }

  private async getAccessToken(code: string) {
    const { clientId, clientSecret, redirectUri, scope } = this.params;

    const params = querystring.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
      scope: scope,
      state: "authStep",
    });

    return await axios.get(
      `https://graph.facebook.com/v7.0/oauth/access_token?${params}`
    );
  }

  private async buildUser(request: Request) {
    const {
      query: { code },
    } = request;

    const { appToken } = this.params;

    if (!appToken) {
      await this.getAppToken();
    }

    try {
      const { data: tokenData } = await this.getAccessToken(String(code));
      const { data: userData } = await this.getUserId(tokenData.access_token);

      const user: FacebookUser = {
        id: userData.id,
        token: { ...tokenData },
        info: {
          ...userData,
          picture: {
            ...userData.picture.data,
          },
        },
      };

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public route(_req: Request, res: Response) {
    const {
      clientId,
      redirectUri,
      authType,
      responseType,
      scope,
    } = this.params;

    res.redirect(
      `https://www.facebook.com/v7.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&auth_type=${authType}&response_type=${responseType}&scope=${scope}&state=codeStep`
    );
  }

  public async responseRoute(request: Request, response: Response) {
    const {
      query: { state, error, error_code },
    } = request;

    if (error && error_code == "200") {
      throw new Error(`Access denied from facebook. error: ${error}`);
    }

    if (!state) {
      throw new Error(`Access denied from facebook. error: ${error}`);
    }
    const user = await this.buildUser(request);
    this.params.doneCallback(user, request, response);
  }
}
