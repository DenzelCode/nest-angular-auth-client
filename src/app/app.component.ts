import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ErrorDialogInterceptor,
  HttpError,
} from './core/interceptor/error-dialog.interceptor';
import { MainSocket } from './core/socket/main-socket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  constructor(
    private errorHandler: ErrorDialogInterceptor,
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
