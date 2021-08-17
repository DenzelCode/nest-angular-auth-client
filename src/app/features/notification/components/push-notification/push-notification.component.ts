import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../../auth/service/auth.service';
import { SubscriptionService } from '../../../user/service/subscription.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
})
export class PushNotificationComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit() {
    this.authService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter<User>(user => user != null),
        mergeMap(() => this.subscriptionService.requestSubscription()),
      )
      .subscribe();

    this.notificationService.updateAvailable$.subscribe();

    this.notificationService.checkForUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
