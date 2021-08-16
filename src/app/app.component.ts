import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import {
  ErrorHandlerInterceptor,
  HttpError,
} from './core/interceptor/error-handler.interceptor';
import { MainSocket } from './core/socket/main-socket';
import { AuthService, User } from './features/auth/service/auth.service';
import { NotificationService } from './features/notification/service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  constructor(
    private errorHandler: ErrorHandlerInterceptor,
    private socket: MainSocket,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.socket
      .fromEvent<HttpError>('exception')
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => this.errorHandler.handleError(e));

    this.authService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter<User>(user => user != null),
        mergeMap(() => this.notificationService.requestSubscription()),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
