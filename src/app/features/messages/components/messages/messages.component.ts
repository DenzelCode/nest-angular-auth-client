import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MainSocket } from '../../../../core/socket/main-socket';
import { User } from '../../../auth/service/auth.service';
import { Room } from '../../../room/service/room.service';
import { Message, MessageService } from '../../service/message.service';

export enum MessageType {
  Direct = 'direct',
  Room = 'room',
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @Input() type: MessageType;
  @Input() room?: Room;
  @Input() to?: User;

  messages: Message[];

  destroy$ = new Subject();
  MessageType = MessageType;

  user?: User;

  constructor(
    private messageService: MessageService,
    private socket: MainSocket,
  ) {}

  ngOnInit(): void {
    this.messageService
      .getMessage(this.type)
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: Message) => {
        this.messages.push(message);
      });
  }

  ngOnDestroy() {
    this.socket.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
