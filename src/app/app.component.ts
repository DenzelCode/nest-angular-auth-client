import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ErrorHandlerInterceptor,
  HttpError,
} from './core/interceptor/error-handler.interceptor';
import { MainSocket } from './core/socket/main-socket';

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
  ) {}

  ngOnInit() {
    this.socket
      .fromEvent<HttpError>('exception')
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => this.errorHandler.handleError(e));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
