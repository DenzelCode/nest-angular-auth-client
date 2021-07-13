import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  userSubject = new BehaviorSubject<User>(null);

  get user(): User {
    return this.userSubject.getValue();
  }

  get isAuthenticated(): boolean {
    return this.user != null;
  }

  constructor(private http: HttpClient) {}

  login(user: Partial<User>) {
    return this.http
      .post<TokenResponse>(`${api}/auth/login`, user)
      .pipe(tap(response => this.setTokens(response)));
  }

  register(user: Partial<User>) {
    return this.http
      .post<TokenResponse>(`${api}/auth/register`, user)
      .pipe(tap(response => this.setTokens(response)));
  }

  getProfile() {
    const fail = () => {
      if (this.getRefreshToken()) {
        this.loginWithRefreshToken().subscribe(
          () => {},
          () => this.logout(),
        );

        return;
      }

      this.logout();
    };

    return this.http
      .get<User>(`${api}/auth/me`, {
        headers: {
          skipNotifier: 'true',
        },
      })
      .pipe(tap(user => this.userSubject.next(user), fail));
  }

  loginWithRefreshToken() {
    return this.http
      .post<TokenResponse>(`${api}/auth/refresh-token`, {
        refreshToken: this.getRefreshToken(),
      })
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

    this.userSubject.next(null);
  }
}
