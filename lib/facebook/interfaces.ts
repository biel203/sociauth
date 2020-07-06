export interface FacebookConfig {
  clientId: string;
  redirectUri: string;
  scope?: Array<string>;
  responseType?: string;
  authType?: string;
  display?: string;
  clientSecret?: string;
}
