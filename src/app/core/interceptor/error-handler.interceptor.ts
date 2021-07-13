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
import { AuthService } from 'src/app/auth/service/auth.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (request.headers?.has('skipNotifier')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      tap(
        () => {},
        response => {
          if (response instanceof HttpErrorResponse) {
            if (response.status === 401 && this.authService.getRefreshToken()) {
              return;
            }

            const error = response.error;

            this.dialog.open(ErrorDialogComponent, {
              data: {
                title: error.error || 'Error',
                message: error.message,
              },
              width: '350px',
            });
          }
        },
      ),
    );
  }
}
