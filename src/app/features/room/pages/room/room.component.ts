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
import { Message } from '../../../messages/service/message.service';
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
  MessageType = MessageType;
  areMembersShown = false;
  messages: Message[] = [];

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

          return this.socket.onConnect();
        }),
        tap(() => this.roomService.subscribeRoom(this.room)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.roomService
      .onJoinEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.room.members.push(user));

    this.roomService
      .onLeaveEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user =>
        remove(this.room.members, u => u === user || u._id === user._id),
      );

    this.roomService
      .onUpdateEvent()
      .pipe(takeUntil<InternalRoom>(this.destroy$))
      .subscribe(room => (this.room = room));

    this.roomService
      .onDeleteEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate(['/rooms']));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
