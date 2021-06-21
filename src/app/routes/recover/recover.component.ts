import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import { RecoverService } from 'src/app/common/service/recover.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent {
  recoverForm = this.formBuilder.group({
    email: '',
  });

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private recoverService: RecoverService
  ) {}

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const clear = () => this.recoverForm.patchValue({ email: '' });

    this.recoverService
      .recoverPassword(this.recoverForm.value.email)
      .pipe(tap(clear, clear), take(1))
      .subscribe(
        () => {
          this.loading = false;

          Swal.fire({
            title: 'Good job!',
            text: 'Check your email and change your password!',
            icon: 'success',
          });
        },
        () => (this.loading = false)
      );
  }
}
