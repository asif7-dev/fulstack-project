import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUser();

  if (currentUser?.role === 'admin') {
    return true;
  }

  // If not admin, restrict access (redirect to dashboard)
  return router.parseUrl('/dashboard');
};
