import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the current `AuthService`.
  const authService: AuthService = inject(AuthService);

  // and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    setHeaders: {
      'authorization': `Bearer ${authToken}`
    }
  });
  return next(newReq);
}
