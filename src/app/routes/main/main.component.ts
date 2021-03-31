import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/auth/service/auth.service';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  get user(): User {
    return this.authService.user;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
