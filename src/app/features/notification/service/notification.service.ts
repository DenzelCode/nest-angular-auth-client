import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SubscriptionService } from '../../user/service/subscription.service';

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
    private subscriptionService: SubscriptionService,
  ) {}

  getConfig() {
    return this.http.get<Config>(`${api}/notification/config`);
  }

  setupEnvironment() {
    return this.requestSubscription().pipe(
      mergeMap(subscription =>
        this.subscriptionService.registerSubscription(subscription),
      ),
    );
  }

  requestSubscription() {
    return this.getConfig().pipe(
      mergeMap(({ webPublicKey: serverPublicKey }) =>
        this.swPush.requestSubscription({ serverPublicKey }),
      ),
    );
  }

  async checkForUpdates() {
    try {
      await this.swUpdate.checkForUpdate();
    } catch (e) {
      console.error('An error occured checking service worker updates', e);
    }
  }
}
