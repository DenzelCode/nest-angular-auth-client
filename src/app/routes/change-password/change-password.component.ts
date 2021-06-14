import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecoverService } from 'src/app/common/service/recover.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm = this.formBuilder.group({
    password: '',
    confirmPassword: '',
  });

  code: string;

  paramsSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private recoverService: RecoverService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params) => (this.code = params.code)
    );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  submit() {
    const clear = () => this.changePasswordForm.patchValue({ pass: '' });

    this.recoverService
      .changePassword(this.code, this.changePasswordForm.value)
      .subscribe(() => {
        Swal.fire({
          title: 'Good job!',
          text: 'Your password was sucessfully updated!',
          icon: 'success',
        });

        this.router.navigate(['/login']);
      }, clear);
  }
}
