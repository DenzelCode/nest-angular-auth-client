import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSocket } from './socket/main-socket';
import { ErrorHandlerInterceptor } from './interceptor/error-handler.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [MainSocket, ErrorHandlerInterceptor],
})
export class CoreModule {}
