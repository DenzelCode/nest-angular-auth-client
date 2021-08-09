import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-join-room-dialog',
  templateUrl: './join-room-dialog.component.html',
  styleUrls: ['./join-room-dialog.component.scss'],
})
export class JoinRoomDialogComponent {
  joinForm = this.formBuilder.group({
    code: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private dialog: MatDialogRef<JoinRoomDialogComponent>,
  ) {}

  submit() {
    this.roomService
      .joinRoom(this.joinForm.value.code)
      .pipe(take(1))
      .subscribe(() => this.dialog.close());
  }
}
