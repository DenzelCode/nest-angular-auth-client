import { Injectable } from '@angular/core';
import { boundMethod } from 'autobind-decorator';
import { Socket } from 'ngx-socket-io';
import { mergeMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/features/auth/service/auth.service';
import { environment } from '../../../environments/environment';

const getOptions = (authService: AuthService) => ({
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
      },
    },
  },
  autoConnect: false,
});

@Injectable()
export class MainSocket extends Socket {
  constructor(private authService: AuthService) {
    super({
      url: environment.socket,
      options: getOptions(authService),
    });

    const io = this.ioSocket.io;
    io.on('reconnect_attempt', this.updateAccessToken);

    this.onConnect().subscribe(() => this.emit('user:subscribe'));

    this.onDisconnect().subscribe(reason => {
      if (reason !== 'io server disconnect') {
        return;
      }

      this.authService
        .loginWithRefreshToken()
        .pipe(take(1))
        .subscribe(() => this.connect());
    });
  }

  connect() {
    this.updateAccessToken();

    super.connect();
  }

  onConnect() {
    return this.fromEvent('connect');
  }

  onDisconnect() {
    return this.fromEvent<string>('disconnect');
  }

  @boundMethod
  updateAccessToken() {
    Object.assign(this.ioSocket?.io?.opts || {}, getOptions(this.authService));
  }
}
