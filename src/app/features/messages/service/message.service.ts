import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MainSocket } from '../../../core/socket/main-socket';
import { User } from '../../auth/service/auth.service';
import { Room } from '../../room/service/room.service';
import { MessageType } from '../components/messages/messages.component';

export interface Message {
  message: string;
  room?: string;
  from?: string;
}
const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private socket: MainSocket, private http: HttpClient) { }

  getMessages(type: MessageType, id: string) {
    return this.http.get<Message[]>(`${api}/message/${type}/${id}`);
  }

  getMessage(type: MessageType) {
    return this.socket.fromEvent(`message:${type}`);
  }

  roomMessage(user: User, type: string): Message {
    const newMessage = {
      from: null,
      to: '',
      message: `${user.username} ${type === 'leave' ? 'left' : 'joined'}`
    }
    return newMessage;
  }

  getRoomLeaveMessages() {
    return this.socket.fromEvent('room:leave').pipe(map((user: User) => this.roomMessage(user, 'leave')));
  }

  getRoomJoinMessages() {
    return this.socket.fromEvent('room:join').pipe(map((user: User) => this.roomMessage(user, 'join')));
  }

  sendRoomMessage(room: Room, message: string) {
    return this.socket.emit(`message:room`, {
      roomId: room._id,
      message,
    });
  }

  sendDirectMessage(to: User, message: string) {
    return this.socket.emit(`message:direct`, {
      to: to._id,
      message,
    });
  }
}
