import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const { api } = environment;

export interface ChangePasswordBody {
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecoverService {
  constructor(private http: HttpClient) {}

  recoverPassword(email: string) {
    return this.http.post(`${api}/recover`, { email });
  }

  validateCode(code: string) {
    return this.http.get(`${api}/recover/${code}`);
  }

  changePassword(code: string, body: ChangePasswordBody) {
    return this.http.post(`${api}/recover/${code}`, body);
  }
}
