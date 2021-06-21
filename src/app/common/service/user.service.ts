import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const { api } = environment;

export interface UpdateUserBody {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  updateUser(data: UpdateUserBody) {
    return this.http.put(`${api}/user/update`, data);
  }
}
