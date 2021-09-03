import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { boundMethod } from 'autobind-decorator';
import { remove } from 'lodash';
import { Subject, timer } from 'rxjs';
import { filter, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { Sound, SoundService } from 'src/app/shared/services/sound.service';
import { HttpError } from '../../../../core/interceptor/error-dialog.interceptor';
import { MainSocket } from '../../../../core/socket/main-socket';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService, User } from '../../../auth/service/auth.service';
import { Room } from '../../../room/service/room.service';
import { Message, MessageService } from '../../service/message.service';

export enum MessageType {
  Direct = 'direct',
  Room = 'room',
}

interface LocalMessage extends Message {
  createdAtDate: Date;
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
  @Input() updateMessages$: Subject<void>;
  @Input() messages: LocalMessage[] = [];

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLDivElement>;

  messageForm = this.formBuilder.group({
    message: '',
  });

  isConnected = false;

  get messagesElement() {
    return this.messagesContainer.nativeElement;
  }

  destroy$ = new Subject();
  MessageType = MessageType;
  user: User;
  firstMessage: Message;

  typing: User[] = [];

  isTyping = false;

  private readonly limit = 30;
  private readonly scrollOffset = 200;
  private readonly typingTimeout = 5000;

  scrolledToLast = false;

  constructor(
    private messageService: MessageService,
    private socket: MainSocket,
    private formBuilder: FormBuilder,
    private soundService: SoundService,
    private authService: AuthService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
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
    this.socket.connect();

    this.socket
      .onConnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isConnected = true;

        if (!this.updateMessages$) {
          this.getMessages();
        }
      });

    this.socket
      .onDisconnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.isConnected = false));

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.user = user));

    this.updateMessages$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(this.getMessages);

    this.messageService
      .onMessage(this.type)
      .pipe(
        takeUntil(this.destroy$),
        filter(
          message =>
            this.isCurrentSection(
              message.to !== this.user._id ? message.to : message.from._id,
              message.room,
            ) && !this.messages.some(msg => msg._id === message._id),
        ),
      )
      .subscribe(this.handleMessageEvent);

    this.messageService
      .onDeleteMessagesEvent(this.type)
      .pipe(
        takeUntil(this.destroy$),
        filter(object => this.isCurrentSection(object._id)),
      )
      .subscribe(() => remove(this.messages, () => true));

    this.messageService
      .onDeleteMessageEvent(this.type)
      .pipe(takeUntil(this.destroy$))
      .subscribe(messageId => {
        if (messageId === this.firstMessage?._id) {
          if (this.messages.some(message => message._id === messageId)) {
            this.firstMessage = this.messages[1];
          } else {
            this.updateFirstMessage();
          }
        }

        remove(this.messages, message => message._id === messageId);
      });

    this.updateFirstMessage();

    this.messageService
      .onTyping(this.type, this.partnerId)
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ({ user, room }) =>
            this.isCurrentSection(user._id, room?._id) &&
            this.user._id !== user._id,
        ),
        tap(({ user }) => {
          if (!this.typing.some(u => u._id === user._id)) {
            this.typing.push(user);
          }

          this.changeDetector.detectChanges();

          this.scrollToLastIfNecessary();
        }),
        mergeMap(({ user }) =>
          timer(this.typingTimeout).pipe(
            takeUntil(
              this.messageService
                .onTyping(this.type, this.partnerId)
                .pipe(
                  filter(
                    ({ user: typingUser, room }) =>
                      this.isCurrentSection(user._id, room?._id) &&
                      user._id === typingUser._id,
                  ),
                ),
            ),
            tap(() => remove(this.typing, u => u._id === user._id)),
          ),
        ),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.socket.disconnect();

    this.destroy$.next();
    this.destroy$.complete();
  }

  @boundMethod
  getMessages() {
    this.messageService
      .getMessages(this.type, this.partnerId, this.limit)
      .pipe(take(1))
      .subscribe(messages => {
        remove(this.messages, () => true);
        this.messages.push(...messages.map(this.convertToLocalMessage));

        this.scrollToLastMessages();
      });
  }

  updateFirstMessage() {
    this.messageService
      .getFirstMessage(this.type, this.partnerId)
      .pipe(take(1))
      .subscribe(message => (this.firstMessage = message));
  }

  getPreviousMessages() {
    const startingScrollHeight = this.messagesElement.scrollHeight;

    this.messageService
      .getMessages(
        this.type,
        this.partnerId,
        this.limit,
        this.messages[0].createdAt,
      )
      .subscribe(messages => {
        this.messages.splice(0, 0, ...messages.map(this.convertToLocalMessage));

        this.changeDetector.detectChanges();

        this.messagesElement.scrollTo(
          0,
          this.messagesElement.scrollHeight - startingScrollHeight,
        );
      });
  }

  @boundMethod
  handleMessageEvent(message: Message) {
    if (message.from._id === this.user._id) {
      this.isTyping = false;
    }

    this.messages.push(this.convertToLocalMessage(message));

    remove(this.typing, user => user._id === message.from._id);

    if (message.from._id !== this.user._id) {
      this.soundService.playSound(Sound.Message);
    }

    this.scrollToLastIfNecessary();

    return;
  }

  isCurrentSection(...objectIds: string[]) {
    return objectIds.some(
      id =>
        (this.room && this.room._id === id) ||
        (this.to && this.to._id === id) ||
        this.user._id === id,
    );
  }

  scrollToLastIfNecessary() {
    const element = this.messagesElement;

    if (
      element.scrollTop >
      element.scrollHeight - element.offsetHeight - this.scrollOffset
    ) {
      this.scrolledToLast = false;

      this.scrollToLastMessages();
    }
  }

  scrollToLastMessages() {
    this.changeDetector.detectChanges();

    this.messagesElement.scrollTo({
      top: this.messagesElement.scrollHeight,
      behavior: 'smooth',
    });

    timer(1000).subscribe(() => (this.scrolledToLast = true));
  }

  sendTyping() {
    if (this.isTyping) {
      return;
    }

    this.messageService.sendTyping(this.type, this.partnerId);

    this.isTyping = true;

    timer(this.typingTimeout - 1000).subscribe(() => (this.isTyping = false));
  }

  sendMessage() {
    const message = this.messageForm.value.message;

    if (!message?.trim()) {
      return;
    }

    if (!this.isConnected) {
      this.handleMessageCallback();
    }

    switch (this.type) {
      case MessageType.Room:
        this.messageService.sendRoomMessage(
          this.room,
          message,
          this.handleMessageCallback,
        );
        break;
      case MessageType.Direct:
        this.messageService.sendDirectMessage(
          this.to,
          message,
          this.handleMessageCallback,
        );
        break;
      default:
        break;
    }
  }

  @boundMethod
  handleMessageCallback(response?: boolean | HttpError) {
    if (typeof response !== 'object') {
      this.messageForm.patchValue({
        message: '',
      });
    }
  }

  onScroll(e: Event) {
    if (
      !this.scrolledToLast ||
      this.messages[0]?._id === this.firstMessage?._id
    ) {
      return;
    }

    const element = e.target as HTMLDivElement;

    if (element.scrollTop <= 5) {
      this.getPreviousMessages();
    }
  }

  confirmDeleteMessage(message: Message) {
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirm => {
        if (confirm) {
          this.deleteMessage(message);
        }
      });
  }

  deleteMessage(message: Message) {
    this.messageService
      .deleteMessage(this.type, message)
      .pipe(take(1))
      .subscribe();
  }

  private convertToLocalMessage(message: Message): LocalMessage {
    return {
      ...message,
      createdAtDate: new Date(message.createdAt),
    };
  }
}
