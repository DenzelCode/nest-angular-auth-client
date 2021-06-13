import { Component } from '@angular/core';
import { AuthService, User } from 'src/app/auth/service/auth.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  get user(): User {
    return this.authService.user;
  }

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
