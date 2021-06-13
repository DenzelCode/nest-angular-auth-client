import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  submit() {
    const user = this.registerForm.value;

    const subscriber = this.authService.register(user).subscribe(
      () => this.router.navigate(['/']),
      () => {
        this.registerForm.patchValue({
          password: '',
        });

        subscriber.unsubscribe();
      }
    );
  }
}
