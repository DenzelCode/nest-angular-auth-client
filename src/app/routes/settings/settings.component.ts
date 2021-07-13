import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth/service/auth.service';
import {
  UpdatePasswordBody,
  UserService,
} from 'src/app/common/service/user.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm = this.formBuilder.group({
    username: '',
    email: '',
    currentPassword: null,
    password: null,
    confirmPassword: null,
  });

  loading = false;

  get user() {
    return this.authService.user;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const { username, email } = this.authService.user;

    this.settingsForm.patchValue({
      username,
      email,
    });
  }

  updateUsername() {
    const { username } = this.settingsForm.value;

    if (this.loading || this.user.username === username) {
      return;
    }

    this.loading = true;

    this.userService.updateUsername(username).subscribe(
      () => {
        this.authService.userSubject.next({
          ...this.authService.user,
          username,
        });

        this.loading = false;

        Swal.fire({
          title: 'Good job!',
          text: 'Your username was sucessfully updated!',
          icon: 'success',
        });
      },
      () => (this.loading = false),
    );
  }

  updateEmail() {
    const { email } = this.settingsForm.value;

    if (this.loading || this.user.email === email) {
      return;
    }

    this.loading = true;

    this.userService.updateEmail(email).subscribe(
      () => {
        this.authService.userSubject.next({
          ...this.authService.user,
          email,
        });

        this.loading = false;

        Swal.fire({
          title: 'Good job!',
          text: 'Your email was sucessfully updated!',
          icon: 'success',
        });
      },
      () => (this.loading = false),
    );
  }

  updatePassword() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const clear = () => {
      this.loading = false;

      this.settingsForm.patchValue({
        currentPassword: null,
        password: null,
        confirmPassword: null,
      });
    };

    const data: UpdatePasswordBody = this.settingsForm.value;

    this.userService.updatePassword(data).subscribe(() => {
      clear();

      Swal.fire({
        title: 'Good job!',
        text: 'Your password was sucessfully updated!',
        icon: 'success',
      });
    }, clear);
  }
}
