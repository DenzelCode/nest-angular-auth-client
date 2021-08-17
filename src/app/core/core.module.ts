import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSocket } from './socket/main-socket';
import { ErrorDialogInterceptor } from './interceptor/error-dialog.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [MainSocket, ErrorDialogInterceptor],
})
export class CoreModule {}
