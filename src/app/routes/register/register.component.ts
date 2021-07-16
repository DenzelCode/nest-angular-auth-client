import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    username: '',
    password: '',
    email: '',
  });

  loading = false;

  constructor(
    private router: Router,
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
        () => this.router.navigate(['/']),
        () => {
          this.loading = false;

          this.registerForm.patchValue({
            password: '',
          });
        },
      );
  }
}
