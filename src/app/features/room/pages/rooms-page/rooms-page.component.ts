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
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.scss'],
})
export class RoomsPageComponent implements OnInit, OnDestroy {
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

  openJoinRoomDialog() {
    this.dialog.open(JoinRoomDialogComponent);
  }
}
