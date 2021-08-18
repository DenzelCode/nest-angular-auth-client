import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { MainComponent } from './main/main.component';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { RoomModule } from './room/room.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    RoomModule,
    MessagesModule,
    NotificationModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule, NotificationModule],
})
export class FeaturesModule {}
