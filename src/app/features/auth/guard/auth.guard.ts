import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const { redirect, requireAuth } = next.data;

    const { isAuthenticated } = this.authService;

    const isAccessAllowed =
      ((requireAuth == null || requireAuth) && isAuthenticated) ||
      (requireAuth === false && !isAuthenticated);

    if (!isAccessAllowed) {
      if (requireAuth == null || requireAuth) {
        this.authService.setLoginCallbackUrl(state.url);
      }

      if (redirect) {
        if (redirect instanceof Array) {
          this.router.navigate([...redirect]);
        } else {
          this.router.navigate([redirect]);
        }

        return false;
      }

      if (this.router.routerState.snapshot.url === '') {
        this.router.navigate(['/login']);

        return false;
      }
    }

    return isAccessAllowed;
  }
}
