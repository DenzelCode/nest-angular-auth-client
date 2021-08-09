import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { MainSocket } from '../../../../core/socket/main-socket';
import { MessageType } from '../../../messages/components/messages/messages.component';
import { Room, RoomService } from '../../service/room.service';

@Component({
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  roomId: string;

  room: Room;

  MessageType = MessageType;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private socket: MainSocket,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        mergeMap(params => {
          this.roomId = params.id;

          return this.roomService.joinRoom(this.roomId);
        }),
      )
      .subscribe(
        room => {
          this.room = room;

          this.socket.connect();

          this.roomService.subscribeRoom(room);
        },
        () => this.router.navigate(['/rooms']),
      );
  }

  ngOnDestroy() {
    this.socket.disconnect();

    this.destroy$.next();
    this.destroy$.complete();
  }

  leave(){
    this.router.navigate(['/rooms']);
  }
}
