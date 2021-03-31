import { NgModule } from '@angular/core';
import { CommonModule as CommonNativeModule } from '@angular/common';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [CommonNativeModule, AngularMaterialModule],
})
export class CoreModule {}
