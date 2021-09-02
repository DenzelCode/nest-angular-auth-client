import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/features/auth/service/auth.service';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  registerForm = this.formBuilder.group({
    username: '',
    password: '',
    email: '',
  });

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  submit() {
    this.loading = true;

    const user = this.registerForm.value;

    this.authService
      .register(user)
      .pipe(take(1))
      .subscribe(
        () => this.authService.redirectToCallback(),
        () => {
          this.loading = false;

          this.registerForm.patchValue({
            password: '',
          });
        },
      );
  }

  async registerWithFacebook() {
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

  async registerWithGoogle() {
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

  async registerWithApple() {
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
}
