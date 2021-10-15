import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MainSocket } from '../../../core/socket/main-socket';
import { AuthTokenInterceptor } from '../../auth/interceptor/auth-token.interceptor';
import { User } from '../../auth/service/auth.service';
import { Room } from '../../room/service/room.service';
import { MessageType } from '../components/messages/messages.component';

export interface Message {
  _id: string;
  message: string;
  to: string;
  room?: string;
  from?: User;
  createdAt?: string;
}

export interface TypingResponse {
  room?: Room;
  user: User;
}

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private socket: MainSocket, private http: HttpClient) {}

  getMessages(type: MessageType, id: string, limit: number, before?: string) {
    const params = { limit, before };

    for (const key of Object.keys(params)) {
      if (!params[key]) {
        delete params[key];
      }
    }

    return this.http.get<Message[]>(`${api}/message/${type}/${id}`, { params });
  }

  getFirstMessage(type: MessageType, id: string) {
    return this.http.get<Message>(`${api}/message/${type}-first-message/${id}`);
  }

  onMessage(type: MessageType) {
    return this.socket.fromEvent<Message>(`message:${type}`);
  }

  sendMessage<T>(
    type: MessageType,
    id: string,
    message: string,
    callback?: (data: T) => void,
  ) {
    return this.socket.emit(
      `message:${type}`,
      {
        to: id,
        roomId: id,
        message,
      },
      callback,
    );
  }

  sendTyping(type: MessageType, id: string) {
    return this.socket.emit(`message:${type}:typing`, id);
  }

  deleteMessage(type: MessageType, message: Message) {
    return this.http.delete<Message>(`${api}/message/${type}`, {
      body: {
        messageId: message._id,
        roomId: message.room,
        to: message.to,
      },
      headers: {
        [AuthTokenInterceptor.skipHeader]: 'true',
      },
    });
  }

  onDeleteMessagesEvent(type: MessageType) {
    return this.socket.fromEvent<string>(`${type}:delete_messages`);
  }

  onDeleteMessageEvent(type: MessageType) {
    return this.socket.fromEvent<string>(`${type}:delete_message`);
  }

  onTyping(type: MessageType, id: string) {
    return this.socket.fromEvent<TypingResponse>(`message:${type}:typing`);
  }
}
