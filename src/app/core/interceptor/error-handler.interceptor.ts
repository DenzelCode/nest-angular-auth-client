import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers?.has('skipNotifier')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      tap(
        (event) => {},
        (response) => {
          if (response instanceof HttpErrorResponse) {
            const error = response.error;

            this.dialog.open(ErrorDialogComponent, {
              data: {
                title: error.error || 'Error',
                message: error.message,
              },
              width: '350px',
            });
          }
        }
      )
    );
  }
}
