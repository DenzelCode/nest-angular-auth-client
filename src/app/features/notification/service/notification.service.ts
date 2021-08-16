import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../environments/environment';

interface Config {
  publicKey: string;
}

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient, private swPush: SwPush) {}

  getPublicKey() {
    return this.http.get<Config>(`${api}/notification/config`);
  }

  requestSubscription() {
    return new Promise<PushSubscription>((resolve, reject) =>
      this.getPublicKey().subscribe(async ({ publicKey }) => {
        this.swPush
          .requestSubscription({
            serverPublicKey: publicKey,
          })
          .then(resolve)
          .catch(reject);
      }),
    );
  }
}
