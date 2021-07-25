import { BaseLoginProvider, SocialUser } from 'angularx-social-login';
import { environment } from '../../../environments/environment';

declare let AppleID: any;

export class AppleLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID: string = 'APPLE';

  protected auth2: any;

  constructor(
    private app: typeof environment.apps.apple,
    private _initOptions: any = { scope: 'email name' },
  ) {
    super();
  }

  public initialize(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.loadScript(
        AppleLoginProvider.PROVIDER_ID,
        'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
        () => {
          AppleID.auth.init({
            clientId: this.app.clientId,
            scope: 'name email',
            redirectURI: this.app.redirectUri,
            usePopup: true,
          });
          resolve();
        },
      );
    });
  }

  public getLoginStatus(): Promise<SocialUser> {
    return new Promise((resolve, reject) => resolve(null));
  }

  public async signIn(signInOptions?: any): Promise<SocialUser> {
    try {
      const data = await AppleID.auth.signIn();

      return {
        name: data.name,
        authorizationCode: data.authorization.code,
        authToken: data.authorization.id_token,
      } as SocialUser;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  public signOut(revoke?: boolean): Promise<void> {
    return new Promise((resolve, reject) => resolve());
  }
}
