import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { MainComponent } from './main/main.component';
import { TasksModule } from './tasks/tasks.module';
import { RecoverModule } from './recover/recover.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { RoomModule } from './room/room.module';
import { ChatModule } from './chat/chat.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    SharedModule,
    TasksModule,
    RecoverModule,
    UserModule,
    AuthModule,
    RoomModule,
    ChatModule,
  ],
  exports: [RouterModule],
})
export class FeaturesModule {}
