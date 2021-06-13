import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent {
  recoverForm = this.formBuilder.group({
    email: '',
  });

  constructor(private formBuilder: FormBuilder) {}

  submit() {}
}
