import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RecoverService } from '../../service/recover.service';

@Component({
  templateUrl: './recover-page.component.html',
  styleUrls: ['./recover-page.component.scss'],
})
export class RecoverPageComponent {
  recoverForm = this.formBuilder.group({
    email: '',
  });

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private recoverService: RecoverService,
  ) {}

  submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const clear = () => {
      this.loading = false;

      this.recoverForm.patchValue({ email: '' });
    };

    this.recoverService
      .recoverPassword(this.recoverForm.value.email)
      .pipe(tap(clear, clear), take(1))
      .subscribe(() =>
        Swal.fire({
          title: 'Good job!',
          text: 'Check your email and change your password!',
          icon: 'success',
        }),
      );
  }
}
