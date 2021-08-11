import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Room, RoomService } from '../../service/room.service';

export enum ActionType {
  Update,
  Create,
}

export interface UpsertDialogData {
  type: ActionType;
  room?: Room;
}

@Component({
  selector: 'app-upsert-room-dialog',
  templateUrl: './upsert-room-dialog.component.html',
  styleUrls: ['./upsert-room-dialog.component.scss'],
})
export class UpsertRoomDialogComponent {
  type: ActionType;
  upsertForm = this.formBuilder.group({
    title: '',
    isPublic: false,
  });

  room: Room;

  ActionType = ActionType;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: UpsertDialogData,
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpsertRoomDialogComponent>,
  ) {
    this.type = data.type;
    this.room = data.room;

    this.upsertForm.patchValue({
      ...this.room,
    });
  }

  submit() {
    const roomInput = this.upsertForm.value;

    let request = this.roomService.createRoom(roomInput);

    if (this.type === ActionType.Update) {
      request = this.roomService.updateRoom(this.room._id, roomInput);
    }

    request.pipe(take(1)).subscribe(room =>
      this.dialogRef.close({
        ...room,
        title: roomInput.title,
        isPublic: roomInput.isPublic,
      }),
    );
  }
}
