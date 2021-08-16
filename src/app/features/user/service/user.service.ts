import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../../auth/service/auth.service';

const { api } = environment;

export interface UpdatePasswordBody {
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(username: string) {
    return this.http.get<User>(`${api}/user/${username}`);
  }

  updateUsername(username: string) {
    return this.http.put(`${api}/settings/username`, { username });
  }

  updateEmail(email: string) {
    return this.http.put(`${api}/settings/email`, { email });
  }

  updatePassword(data: UpdatePasswordBody) {
    return this.http.put(`${api}/settings/password`, data);
  }
}
