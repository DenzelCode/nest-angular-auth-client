import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { of } from 'rxjs';
import { catchError, mergeMap, tap, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthTokenInterceptor } from '../../auth/interceptor/auth-token.interceptor';

interface Config {
  webPublicKey: string;
}

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  updateAvailable$ = this.swUpdate.available.pipe(
    tap(async () => {
      await this.swUpdate.activateUpdate();

      document.location.reload();
    }),
  );

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
  ) {}

  getConfig() {
    return this.http.get<Config>(`${api}/notification/config`);
  }

  requestSubscription() {
    return this.getConfig().pipe(
      mergeMap(({ webPublicKey: serverPublicKey }) =>
        this.swPush.requestSubscription({ serverPublicKey }),
      ),
      tap(subscription => this.setSubscription(subscription)),
    );
  }

  getSubscription(): PushSubscription {
    return JSON.parse(sessionStorage.getItem('notificationToken') || '{}');
  }

  setSubscription(subscription: PushSubscription) {
    sessionStorage.setItem('notificationToken', JSON.stringify(subscription));
  }

  async checkForUpdates() {
    try {
      await this.swUpdate.checkForUpdate();
    } catch (e) {
      console.error('An error occured checking service worker updates', e);
    }
  }
}
