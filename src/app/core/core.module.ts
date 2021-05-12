import { NgModule } from '@angular/core';
import { CommonModule as CommonNativeModule } from '@angular/common';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MainSocket } from './socket/main-socket';

@NgModule({
  declarations: [ErrorDialogComponent, ConfirmDialogComponent],
  imports: [CommonNativeModule, AngularMaterialModule],
  providers: [MainSocket],
})
export class CoreModule {}
