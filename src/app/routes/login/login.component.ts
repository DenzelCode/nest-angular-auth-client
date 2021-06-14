import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';

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
    private authService: AuthService
  ) {}

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const user = this.loginForm.value;

    const subscriber = this.authService.login(user).subscribe(
      () => {
        this.loading = false;

        this.router.navigate(['/']);
      },
      () => {
        this.loading = false;

        this.loginForm.patchValue({
          password: '',
        });

        subscriber.unsubscribe();
      }
    );
  }
}
