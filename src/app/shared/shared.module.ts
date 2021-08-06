import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ConfirmDialogComponent, ErrorDialogComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  exports: [
    ConfirmDialogComponent,
    ErrorDialogComponent,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
})
export class SharedModule {}
