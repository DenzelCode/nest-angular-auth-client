import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';
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

  constructor(
    private formBuilder: FormBuilder,
    private recoverService: RecoverService
  ) {}

  submit() {
    const clear = () => this.recoverForm.patchValue({ email: '' });

    this.recoverService
      .recoverPassword(this.recoverForm.value.email)
      .pipe(tap(clear, clear))
      .subscribe(() => {
        Swal.fire({
          title: 'Good job!',
          text: 'Check your email and change your password!',
          icon: 'success',
        });
      });
  }
}
