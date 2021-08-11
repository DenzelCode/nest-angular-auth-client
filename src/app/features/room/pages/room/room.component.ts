import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { remove } from 'lodash';
import { Subject } from 'rxjs';
import {
  catchError,
  filter,
  mergeMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { MainSocket } from '../../../../core/socket/main-socket';
import { User } from '../../../auth/service/auth.service';
import { MessageType } from '../../../messages/components/messages/messages.component';
import { Room, RoomService } from '../../service/room.service';

interface InternalRoom extends Room {
  members: User[];
}

@Component({
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  roomId: string;
  room: InternalRoom;
  destroy$ = new Subject();
  updateMessages$ = new Subject();
  MessageType = MessageType;
  areMembersShown = true;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private socket: MainSocket,
    private router: Router,
  ) {}

  ngOnInit() {
    // Subscribe to room events
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        mergeMap(params => {
          this.roomId = params.id;

          return this.roomService.joinRoom(this.roomId);
        }),
        take(1),
        catchError(() => this.router.navigate(['/rooms'])),
        filter<InternalRoom>(room => typeof room !== 'boolean'),
        mergeMap(room => {
          this.room = room;

          this.socket.connect();

          return this.socket.onConnect();
        }),
        tap(() => {
          this.roomService.subscribeRoom(this.room);

          this.updateMessages$.next();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.roomService
      .getRoomJoinEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.room.members.push(user));

    this.roomService
      .getRoomLeaveEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user =>
        remove(this.room.members, u => u === user || u._id === user._id),
      );

    this.roomService
      .getRoomUpdateEvent()
      .pipe(takeUntil<InternalRoom>(this.destroy$))
      .subscribe(room => (this.room = room));
  }

  ngOnDestroy() {
    this.socket.disconnect();

    this.destroy$.next();
    this.destroy$.complete();
    this.updateMessages$.complete();
  }
}
