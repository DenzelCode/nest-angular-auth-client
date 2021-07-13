import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, take, mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    request = this.handleRequest(request);

    return next.handle(request).pipe(
      catchError(response => {
        if (response instanceof HttpErrorResponse && response.status === 401) {
          if (this.authService.getRefreshToken()) {
            return this.authService.loginWithRefreshToken().pipe(
              take(1),
              tap(
                () => {},
                () => this.authService.logout(),
              ),
              mergeMap(() => next.handle(this.handleRequest(request))),
            );
          }

          this.authService.logout();
        }

        return throwError(response);
      }),
    );
  }

  handleRequest(request: HttpRequest<unknown>) {
    const token = localStorage.getItem('accessToken');

    request = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });

    request = request.clone({
      headers: request.headers.set('Content-Type', 'application/json'),
    });

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    return request;
  }
}
