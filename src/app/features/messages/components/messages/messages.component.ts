import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { boundMethod } from 'autobind-decorator';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
  @Input() updateMessagesSubject: Subject<void>;

  messageForm = this.formBuilder.group({
    message: '',
  });

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement>;

  get messagesElement() {
    return this.messagesContainer.nativeElement;
  }

  messages: Message[] = [];
  destroy$ = new Subject();
  MessageType = MessageType;
  user?: User;

  private readonly scrollOffset = 200;

  constructor(
    private messageService: MessageService,
    private socket: MainSocket,
    private formBuilder: FormBuilder,
  ) {}

  get partnerId() {
    switch (this.type) {
      case MessageType.Room:
        return this.room._id;
      case MessageType.Direct:
        return this.to._id;
      default:
        return undefined;
    }
  }

  ngOnInit(): void {
    this.updateMessagesSubject
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(this.getMessages);

    this.messageService
      .getMessage(this.type)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.handleMessageEvent);
  }

  ngOnDestroy() {
    this.socket.disconnect();

    this.destroy$.next();
    this.destroy$.complete();
  }

  @boundMethod
  getMessages() {
    return this.messageService
      .getMessages(this.type, this.partnerId)
      .pipe(take(1))
      .subscribe(this.handleMessageEvent);
  }

  @boundMethod
  handleMessageEvent(message: Message | Message[]) {
    if (Array.isArray(message)) {
      this.messages = message;
    } else {
      this.messages.push(message);
    }

    this.scrollToLastIfNecessary();

    return;
  }

  scrollToLastIfNecessary() {
    const element = this.messagesElement;

    if (
      element.scrollTop >
      element.offsetTop - element.scrollHeight - this.scrollOffset
    ) {
      setTimeout(() => this.scrollToLastMessages());
    }
  }

  scrollToLastMessages() {
    this.messagesElement.scrollTo({
      top: this.messagesElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  sendMessage() {
    const message = this.messageForm.value.message;

    if (!message?.trim()) {
      return;
    }

    this.messageForm.patchValue({
      message: '',
    });

    if (this.type === MessageType.Room) {
      this.messageService.sendRoomMessage(this.room, message);

      return;
    }

    this.messageService.sendDirectMessage(this.to, message);
  }
}
