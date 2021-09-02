import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { mergeMap, take } from 'rxjs/operators';
import { RecoverService } from '../../service/recover.service';

@Component({
  templateUrl: './recover-change-password-page.component.html',
  styleUrls: ['./recover-change-password-page.component.scss'],
})
export class RecoverChangePasswordPageComponent implements OnInit, OnDestroy {
  changePasswordForm = this.formBuilder.group({
    password: '',
    confirmPassword: '',
  });

  code: string;

  paramsSubscription: Subscription;

  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private recoverService: RecoverService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params
      .pipe(
        mergeMap(({ code }) => {
          this.code = code;

          return this.recoverService.validateCode(this.code).pipe(take(1));
        }),
      )
      .subscribe(
        () => (this.loading = false),
        () => this.router.navigate(['/']),
      );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const clear = () => {
      this.loading = false;

      this.changePasswordForm.patchValue({
        password: '',
        confirmPassword: '',
      });
    };

    this.recoverService
      .changePassword(this.code, this.changePasswordForm.value)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;

        Swal.fire({
          title: 'Good job!',
          text: 'Your password was sucessfully updated!',
          icon: 'success',
        });

        this.router.navigate(['/login']);
      }, clear);
  }
}
