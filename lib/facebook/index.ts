import { FacebookConfig } from "./interfaces";
import { Request, Response } from "express";

export default class FacebookProvider {
  private params: FacebookConfig = {
    clientId: "",
    redirectUri: "",
  };

  constructor(data: any) {
    if (!data.clientId) {
      throw new Error("Missing clientId parameter.");
    }

    if (!data.redirectUri) {
      throw new Error("Missing redirectUri parameter.");
    }

    this.params.clientId = data.clientId;
    this.params.redirectUri = data.redirectUri;
    this.params.scope = data.scope
      ? data.scope.join(",")
      : ["email", "user_friends"].join(",");
    this.params.responseType = data.responseType || "code";
    this.params.authType = data.authType || "rerequest";
    this.params.display = data.display || "popup";

    this.route = this.route.bind(this);
  }

  route(_req: Request, res: Response) {
    const { clientId, redirectUri, authType } = this.params;

    res.redirect(
      `https://www.facebook.com/v7.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&auth_type=${authType}`
    );
  }
}
