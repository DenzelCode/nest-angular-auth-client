import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../notification/service/notification.service';

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {}

  registerSubscription(subscription: PushSubscription) {
    return this.http.post(`${api}/subscription/web`, {
      subscription,
    });
  }

  delete() {
    return this.notificationService.requestSubscription().pipe(
      take(1),
      mergeMap(subscription =>
        this.http.delete(`${api}/subscription/web`, {
          body: {
            subscription,
          },
        }),
      ),
    );
  }
}
