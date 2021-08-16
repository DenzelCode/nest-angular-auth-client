import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './components/messages/messages.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectMessageComponent } from './pages/direct-message/direct-message.component';

@NgModule({
  declarations: [MessagesComponent, DirectMessageComponent],
  imports: [CommonModule, SharedModule],
  exports: [MessagesComponent, DirectMessageComponent],
})
export class MessagesModule {}
