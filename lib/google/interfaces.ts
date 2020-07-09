export interface GoogleConfig {
  clientId: string;
  redirectUri: string;
  doneCallback: Function;
  scope?: string;
  responseType?: string;
  accessType?: string;
  display?: string;
  clientSecret?: string;
  appToken?: string;
  prompt?: string;
}

export interface GoogleUser {
  id: string;
  token: {
    access_token: string;
    auth_type?: string;
    expires_in?: number;
    token_type?: string;
  };
  info: {
    email: string;
    family_name: string;
    given_name: string;
    locale: string;
    name: string;
    picture: string;
    verified_email: boolean;
  };
}
