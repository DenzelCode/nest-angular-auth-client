import { Injectable } from '@angular/core';
import { Socket as Base } from 'ngx-socket-io';
import { AuthService } from 'src/app/auth/service/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class MainSocket extends Base {
  constructor(private authService: AuthService) {
    super({
      url: environment.socket,
      options: {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${authService.getAccessToken()}`,
            },
          },
        },
      },
    });
  }

  connect() {
    Object.assign(this.ioSocket?.io?.opts || {}, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        },
      },
    });

    super.connect();
  }
}
