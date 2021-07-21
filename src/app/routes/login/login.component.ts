import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
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
    try {
      const observer = await this.authService.loginWithFacebook();

      observer.subscribe(() => this.router.navigate(['/']));
    } catch (e) {
      Swal.fire({
        title: 'Oops...!',
        text: 'Authentication cancelled',
        icon: 'error',
      });
    }
  }

  async loginWithGoogle() {
    try {
      const observer = await this.authService.loginWithGoogle();

      observer.subscribe(() => this.router.navigate(['/']));
    } catch (e) {
      Swal.fire({
        title: 'Oops...!',
        text: 'Authentication cancelled',
        icon: 'error',
      });
    }
  }
}
