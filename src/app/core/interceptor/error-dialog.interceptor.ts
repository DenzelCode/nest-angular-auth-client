import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  ErrorDialogComponent,
  ErrorDialogData,
} from '../../shared/components/error-dialog/error-dialog.component';
import { AuthService } from 'src/app/features/auth/service/auth.service';
import { AuthTokenInterceptor } from '../../features/auth/interceptor/auth-token.interceptor';

export interface HttpError {
  statusCode: number;
  message: string;
  error?: string;
}

@Injectable()
export class ErrorDialogInterceptor implements HttpInterceptor {
  static skipHeader = 'errorDialog';

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.has(ErrorDialogInterceptor.skipHeader)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      tap(
        () => {},
        response => {
          if (response instanceof HttpErrorResponse) {
            if (
              response.status === 401 &&
              this.authService.getRefreshToken() &&
              !request.headers.has(AuthTokenInterceptor.skipHeader)
            ) {
              return;
            }

            this.handleError(response.error);
          }
        },
      ),
    );
  }

  handleError(err: HttpError) {
    this.dialog.open<ErrorDialogData>(ErrorDialogComponent, {
      data: {
        title: err.error || 'Error',
        message: err.message,
      },
      width: '350px',
    });
  }
}
