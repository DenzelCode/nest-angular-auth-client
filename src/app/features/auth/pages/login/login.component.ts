import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  loading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const user = this.loginForm.value;

    this.authService
      .login(user)
      .pipe(take(1))
      .subscribe(
        () => this.router.navigate(['/']),
        () => {
          this.loading = false;

          this.loginForm.patchValue({
            password: '',
          });
        },
      );
  }

  async loginWithFacebook() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      await this.authService.handleSocialLogin(() =>
        this.authService.loginWithFacebook(),
      );
    } finally {
      this.loading = false;
    }
  }

  async loginWithApple() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      await this.authService.handleSocialLogin(() =>
        this.authService.loginWithApple(),
      );
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      await this.authService.handleSocialLogin(() =>
        this.authService.loginWithGoogle(),
      );
    } finally {
      this.loading = false;
    }
  }
}