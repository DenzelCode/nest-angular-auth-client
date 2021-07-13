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
    state: RouterStateSnapshot
  ): boolean {
    const { redirect, requireAuth } = next.data;

    const { isAuthenticated } = this.authService;

    const isAccessAllowed =
      ((requireAuth == null || requireAuth === true) && isAuthenticated) ||
      (requireAuth === false && !isAuthenticated);

    if (!isAccessAllowed) {
      if (redirect) {
        if (redirect instanceof Array) {
          this.router.navigate([...redirect]);
        } else {
          this.router.navigate([redirect]);
        }

        return isAccessAllowed;
      }

      if (this.router.routerState.snapshot.url === '') {
        this.router.navigate(['/']);
      }
    }

    return isAccessAllowed;
  }
}
