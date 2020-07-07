export interface FacebookConfig {
  clientId: string;
  redirectUri: string;
  doneCallback: Function;
  scope?: string;
  responseType?: string;
  authType?: string;
  display?: string;
  clientSecret?: string;
  appToken?: string;
  searchParams?: string;
}

export interface FacebookUser {
  id: string;
  token: {
    access_token: string;
    auth_type: string;
    expires_in: number;
    token_type: string;
  };
  info: {
    email: string;
    picture: string;
  };
}
