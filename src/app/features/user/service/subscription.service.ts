import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ErrorDialogInterceptor } from '../../../core/interceptor/error-dialog.interceptor';
import { AuthTokenInterceptor } from '../../auth/interceptor/auth-token.interceptor';
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

  requestSubscription() {
    return this.notificationService
      .requestSubscription()
      .pipe(mergeMap(subscription => this.registerSubscription(subscription)));
  }

  registerSubscription(subscription: PushSubscription) {
    return this.http.post(`${api}/subscription/web`, {
      subscription,
    });
  }

  delete() {
    const subscription = this.notificationService.getSubscription();

    if (!subscription) {
      return of();
    }

    return this.http.delete(`${api}/subscription/web`, {
      body: {
        subscription,
      },
      headers: {
        [AuthTokenInterceptor.skipHeader]: 'true',
        [ErrorDialogInterceptor.skipHeader]: 'true',
      },
    });
  }
}
