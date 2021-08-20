import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { updateItem } from '../../../../shared/utils/upsert-item';
import { AuthService, User } from '../../../auth/service/auth.service';
import { JoinRoomDialogComponent } from '../../components/join-room-dialog/join-room-dialog.component';
import {
  ActionType,
  UpsertRoomDialogComponent,
} from '../../components/upsert-room-dialog/upsert-room-dialog.component';
import { Room, RoomService } from '../../service/room.service';

@Component({
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit, OnDestroy {
  publicRooms: Room[] = [];
  userRooms: Room[] = [];
  memberRooms: Room[] = [];
  user: User;

  loading = false;

  destroy$ = new Subject();

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private authService: AuthService,
    private clipboard: Clipboard,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = true;

    const process = () => (this.loading = false);

    forkJoin({
      userRooms: this.roomService.getUserRooms().pipe(take(1)),
      publicRooms: this.roomService.getPublicRooms().pipe(take(1)),
      memberRooms: this.roomService.getRoomsByMember().pipe(take(1)),
    })
      .pipe(tap(process, process))
      .subscribe(({ userRooms, publicRooms, memberRooms }) => {
        this.publicRooms = publicRooms;
        this.userRooms = userRooms;
        this.memberRooms = memberRooms;
      });

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.user = user));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  joinRoom(room: Room) {
    this.loading = true;

    const process = () => (this.loading = false);

    this.roomService
      .getRoom(room._id)
      .pipe(take(1), tap(process, process))
      .subscribe(() => this.router.navigate(['/room', room._id]));
  }

  confirmLeaveRoom(room: Room) {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.leaveRoom(room);
        }
      });
  }

  leaveRoom(room: Room) {
    this.loading = true;

    const process = () => (this.loading = false);

    this.roomService
      .leaveRoom(room._id)
      .pipe(take(1), tap(process, process))
      .subscribe(() => remove(this.memberRooms, r => r._id === room._id));
  }

  openJoinRoomDialog() {
    this.dialog.open(JoinRoomDialogComponent);
  }

  openUpdateDialog(room: Room) {
    const dialog = this.dialog.open(UpsertRoomDialogComponent, {
      data: {
        type: ActionType.Update,
        room,
      },
    });

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((updatedRoom: Room) => {
        updateItem(this.publicRooms, r => r._id === room._id, updatedRoom);
        updateItem(this.memberRooms, r => r._id === room._id, updatedRoom);
        updateItem(this.userRooms, r => r._id === room._id, updatedRoom);
      });
  }

  openCreateDialog() {
    const dialog = this.dialog.open(UpsertRoomDialogComponent, {
      data: {
        type: ActionType.Create,
      },
    });

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((room: Room) => {
        if (room.isPublic) {
          this.publicRooms.push(room);
        }

        this.userRooms.push(room);
      });
  }

  confirmDelete(room: Room) {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.delete(room);
        }
      });
  }

  delete(room: Room) {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.roomService
      .deleteRoom(room)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;

        remove(this.userRooms, r => r._id === room._id);
        remove(this.publicRooms, r => r._id === room._id);
        remove(this.memberRooms, r => r._id === room._id);
      });
  }

  copyUrl(room: Room) {
    this.clipboard.copy(`${window.location.origin}/room/${room._id}`);
  }
}
