import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/auth/service/auth.service';
import {
  UpdateUserBody,
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
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const { username, email } = this.authService.user;

    this.settingsForm.patchValue({
      username,
      email,
    });
  }

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const clear = () => {
      this.loading = false;

      this.settingsForm.patchValue({
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    };

    const data: UpdateUserBody = this.settingsForm.value;

    this.userService.updateUser(data).subscribe(() => {
      this.authService.userSubject.next({
        ...this.authService.user,
        username: data.username,
        email: data.email,
      });

      clear();

      Swal.fire({
        title: 'Good job!',
        text: 'Your account was sucessfully updated!',
        icon: 'success',
      });
    }, clear);
  }
}
