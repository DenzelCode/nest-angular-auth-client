import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { SharedModule } from '../../shared/shared.module';
import { RoomService } from './service/room.service';
import { UpsertRoomDialogComponent } from './components/upsert-room-dialog/upsert-room-dialog.component';
import { JoinRoomDialogComponent } from './components/join-room-dialog/join-room-dialog.component';
import { RoomComponent } from './pages/room/room.component';
import { MessagesModule } from '../messages/messages.module';

@NgModule({
  declarations: [
    RoomsComponent,
    UpsertRoomDialogComponent,
    JoinRoomDialogComponent,
    RoomComponent,
  ],
  imports: [CommonModule, SharedModule, MessagesModule],
  providers: [RoomService],
  exports: [RoomsComponent, RoomComponent],
})
export class RoomModule {}
