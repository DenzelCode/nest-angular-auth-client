import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSocket } from './socket/main-socket';

@NgModule({
  imports: [CommonModule],
  providers: [MainSocket],
})
export class CoreModule {}
