import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MainSocket } from '../../../core/socket/main-socket';
import { User } from '../../auth/service/auth.service';

const { api } = environment;

export interface Room {
  _id: string;
  title: string;
  isPublic: boolean;
  members: User[] | string[];
  owner: User | string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private socket: MainSocket, private http: HttpClient) {}

  getRoom(roomId: string) {
    return this.http.get<Room>(`${api}/room/id/${roomId}`);
  }

  getPublicRooms() {
    return this.http.get<Room[]>(`${api}/room/public`);
  }

  getRoomsByMember() {
    return this.http.get<Room[]>(`${api}/room/member`);
  }

  getUserRooms() {
    return this.http.get<Room[]>(`${api}/room`);
  }

  createRoom(room: Partial<Room>) {
    return this.http.post<Room>(`${api}/room`, room);
  }

  deleteRoom(room: Room) {
    return this.http.delete(`${api}/room/delete/${room._id}`);
  }

  updateRoom(id: string, room: Room) {
    return this.http.put<Room>(`${api}/room/${id}`, room);
  }

  joinRoom(roomId: string) {
    return this.http.post<Room>(`${api}/room/join`, { roomId });
  }

  leaveRoom(roomId: string) {
    return this.http.delete<Room>(`${api}/room/leave/${roomId}`);
  }

  subscribeRoom(room: Room) {
    this.socket.emit('room:subscribe', room._id);
  }

  onLeaveEvent() {
    return this.socket.fromEvent<User>('room:leave');
  }

  onJoinEvent() {
    return this.socket.fromEvent<User>('room:join');
  }

  onUpdateEvent() {
    return this.socket.fromEvent<Room>('room:update');
  }

  onDeleteEvent() {
    return this.socket.fromEvent<Room>('room:delete');
  }
}
