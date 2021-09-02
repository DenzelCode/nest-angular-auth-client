import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './components/messages/messages.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectMessagePageComponent } from './pages/direct-message-page/direct-message-page.component';

@NgModule({
  declarations: [MessagesComponent, DirectMessagePageComponent],
  imports: [CommonModule, SharedModule],
  exports: [MessagesComponent, DirectMessagePageComponent],
})
export class MessagesModule {}
