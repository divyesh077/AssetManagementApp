import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';

import { SnackBarService } from '../services/snack-bar.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBarService: SnackBarService = inject(SnackBarService);
  const authService: AuthService = inject(AuthService);

  return next(req)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        //console.error("errorInterceptor : err : ", err);
        const { error } = err.error;
        const { statusCode } = error;
        if (statusCode === 401) {
          authService.autoLogin();
        }
        snackBarService.openErrorSnackBar(err.error.message);
        return throwError(err.error);
      })
    );
};


