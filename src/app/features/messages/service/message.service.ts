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


  getRoomLeaveEvent() {
    return this.socket.fromEvent('room:leave');
  }

  getRoomJoinEvent() {
    return this.socket.fromEvent('room:join');
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
