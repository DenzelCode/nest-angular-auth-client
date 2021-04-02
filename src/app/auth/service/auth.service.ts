import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { api } from '../../../../config.json';

export interface TokenResponse {
  access_token: string;
}

export interface User {
  username: string;
  password: string;
  email: string;
}

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
      .pipe(tap((response) => this.setToken(response.access_token)));
  }

  register(user: Partial<User>) {
    return this.http
      .post<TokenResponse>(`${api}/auth/register`, user)
      .pipe(tap((response) => this.setToken(response.access_token)));
  }

  getProfile() {
    return this.http
      .get<User>(`${api}/auth/me`, {
        headers: {
          skipNotifier: 'true',
        },
      })
      .pipe(
        tap(
          (user) => {
            this.userSubject.next(user);
          },
          () => this.userSubject.next(null)
        )
      );
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  async setToken(token: string) {
    localStorage.setItem('accessToken', token);

    await this.getProfile().toPromise();
  }

  logout() {
    localStorage.clear();

    this.userSubject.next(null);
  }
}
