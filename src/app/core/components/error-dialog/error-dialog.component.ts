import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ErrorDialogData {
  title: string;
  message: string | string[];
}

@Component({
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
})
export class ErrorDialogComponent implements OnInit {
  title: ErrorDialogData['title'];
  message: ErrorDialogData['message'];

  constructor(@Inject(MAT_DIALOG_DATA) data: ErrorDialogData) {
    this.title = data.title || 'Error';
    this.message =
      data.message instanceof Array ? data.message : [data.message || ''];
  }

  ngOnInit(): void {}
}
