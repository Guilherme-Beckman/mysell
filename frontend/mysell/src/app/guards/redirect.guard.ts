import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const router = inject(Router);
  const emailToValidate = localStorage.getItem('emailToValidate');

  if (emailToValidate) {
    return router.parseUrl('/email-validation');
  }
  return router.parseUrl('/login');
};
