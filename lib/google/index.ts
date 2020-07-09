import { GoogleConfig, GoogleUser } from "./interfaces";
import { Request, Response } from "express";
import querystring from "querystring";
import axios from "axios";

export enum scope {
  EMAIL = "https://www.googleapis.com/auth/userinfo.email",
  NAME = "https://www.googleapis.com/auth/userinfo.profile",
}

export enum responseType {
  CODE = "code",
}

export enum accessType {
  OFFLINE = "offline",
}

export enum prompt {
  CONSENT = "consent",
}

export default class GoogleProvider {
  private params: GoogleConfig;

  constructor(data: GoogleConfig) {
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
      scope: data.scope ?? [scope.EMAIL, scope.NAME].join(" "),
      responseType: data.responseType ?? responseType.CODE,
      accessType: data.accessType ?? accessType.OFFLINE,
      prompt: prompt.CONSENT,
    };

    this.route = this.route.bind(this);
    this.responseRoute = this.responseRoute.bind(this);
  }

  private async getAccessToken(code: string) {
    const { clientId, clientSecret, redirectUri } = this.params;

    const { data } = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "post",
      data: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code,
      },
    });

    return data.access_token;
  }

  private async getUserInfo(accessToken: string) {
    const { data } = await axios({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user: GoogleUser = {
      id: data.id,
      token: {
        access_token: accessToken,
      },
      info: {
        ...data,
      },
    };

    return user;
  }

  public route(_req: Request, res: Response) {
    const {
      clientId,
      redirectUri,
      responseType,
      scope,
      accessType,
      prompt,
    } = this.params;

    const stringifiedParams = querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: responseType,
      access_type: accessType,
      prompt: prompt,
    });

    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    );
  }

  public async responseRoute(request: Request, response: Response) {
    const {
      query: { code, error, error_code },
    } = request;

    if (error && error_code == "200") {
      throw new Error(`Access denied from google. error: ${error}`);
    }

    if (!code) {
      throw new Error(`Invalid Code. error: ${error}`);
    }

    const accessToken = await this.getAccessToken(String(code));
    const user = await this.getUserInfo(String(accessToken));
    this.params.doneCallback(user, request, response);
  }
}
