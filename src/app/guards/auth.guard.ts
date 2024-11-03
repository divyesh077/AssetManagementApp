import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs';

export const authGuard: CanMatchFn = (route, segments) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  return authService.isAuthenticated()
    .pipe(
      take(1),
      map((isAuth: boolean) => !!isAuth),
      tap((isAuth: boolean) => {
        if (!isAuth) {
          router.navigate(['/login']);
        }
      })
    )
};
