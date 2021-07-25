import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AppleLoginProvider } from '../provider/apple-login.provider';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  username: string;
  password: string;
  email: string;
}

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);

  get user(): User {
    return this.user$.getValue();
  }

  get isAuthenticated(): boolean {
    return this.user != null;
  }

  constructor(
    private http: HttpClient,
    private socialService: SocialAuthService,
    private router: Router,
  ) {}

  login(user: Partial<User>) {
    return this.http
      .post<TokenResponse>(`${api}/auth/login`, user)
      .pipe(tap(response => this.setTokens(response)));
  }

  loginWithFacebook() {
    return this.loginWith(FacebookLoginProvider.PROVIDER_ID, {
      scope: 'email,public_profile',
      return_scopes: true,
      enable_profile_selector: true,
    });
  }

  loginWithGoogle() {
    return this.loginWith(GoogleLoginProvider.PROVIDER_ID, {
      scope: 'profile email',
    });
  }

  loginWithApple() {
    return this.loginWith(AppleLoginProvider.PROVIDER_ID, {
      scope: 'profile email',
    });
  }

  handleSocialLogin(method: () => Promise<Observable<TokenResponse>>) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const observer = await method();

        observer.subscribe(() => {
          resolve();

          this.router.navigate(['/']);
        });
      } catch (e) {
        Swal.fire({
          title: 'Oops...!',
          text:
            e.message ||
            e.details ||
            'An error occurred completing the authentication',
          icon: 'error',
        });

        reject(e);
      }
    });
  }

  private async loginWith(providerId: string, options?: any) {
    const user = await this.socialService.signIn(providerId);

    return this.http
      .post<TokenResponse>(
        `${api}/auth/${this.getProviderUri(providerId)}-login`,
        {
          accessToken: user.authToken,
        },
      )
      .pipe(
        take(1),
        tap(response => this.setTokens(response)),
      );
  }

  private getProviderUri(providerId: string) {
    switch (providerId) {
      case FacebookLoginProvider.PROVIDER_ID:
        return 'facebook';
      case GoogleLoginProvider.PROVIDER_ID:
        return 'google';
      case AppleLoginProvider.PROVIDER_ID:
        return 'apple';
      default:
        return undefined;
    }
  }

  register(user: Partial<User>) {
    return this.http
      .post<TokenResponse>(`${api}/auth/register`, user)
      .pipe(tap(response => this.setTokens(response)));
  }

  getProfile() {
    return this.http
      .get<User>(`${api}/auth/me`, {
        headers: {
          skipNotifier: 'true',
        },
      })
      .pipe(tap(user => this.user$.next(user)));
  }

  loginWithRefreshToken() {
    return this.http
      .post<TokenResponse>(
        `${api}/auth/refresh-token`,
        {
          refreshToken: this.getRefreshToken(),
        },
        {
          headers: {
            skipTokenInterceptor: 'true',
          },
        },
      )
      .pipe(tap(response => this.setTokens(response)));
  }

  logoutFromAllDevices() {
    return this.http
      .delete<TokenResponse>(`${api}/auth/logout-from-all-devices`)
      .pipe(tap(response => this.setTokens(response)));
  }

  async setTokens(response: TokenResponse) {
    this.setRefreshToken(response.refresh_token);

    await this.setAccessToken(response.access_token);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);

    await this.getProfile().toPromise();
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  logout() {
    localStorage.clear();

    this.user$.next(null);
  }
}
