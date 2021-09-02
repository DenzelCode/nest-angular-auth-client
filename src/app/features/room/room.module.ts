import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsPageComponent } from './pages/rooms-page/rooms-page.component';
import { SharedModule } from '../../shared/shared.module';
import { RoomService } from './service/room.service';
import { UpsertRoomDialogComponent } from './components/upsert-room-dialog/upsert-room-dialog.component';
import { JoinRoomDialogComponent } from './components/join-room-dialog/join-room-dialog.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';
import { MessagesModule } from '../messages/messages.module';
import { RoomItemComponent } from './components/room-item/room-item.component';

@NgModule({
  declarations: [
    RoomsPageComponent,
    UpsertRoomDialogComponent,
    JoinRoomDialogComponent,
    RoomPageComponent,
    RoomItemComponent,
  ],
  imports: [CommonModule, SharedModule, MessagesModule],
  providers: [RoomService],
  exports: [RoomsPageComponent, RoomPageComponent],
})
export class RoomModule {}
