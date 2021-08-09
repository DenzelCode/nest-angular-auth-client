import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './components/messages/messages.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MessagesComponent],
  imports: [CommonModule, SharedModule],
  exports: [MessagesComponent],
})
export class MessagesModule {}
