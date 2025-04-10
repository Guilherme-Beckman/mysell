import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const emailToValidate = localStorage.getItem('emailToValidate');

  if (emailToValidate) {
    router.navigate(['/email-validation']);
    return false;
  }
  return true;
};
