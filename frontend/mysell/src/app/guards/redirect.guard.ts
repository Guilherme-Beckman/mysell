import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const router = inject(Router);
  const emailToValidate = localStorage.getItem('emailToValidate');

  if (emailToValidate) {
    // Retorna UrlTree, e o Angular redireciona para '/email-validation'
    return router.parseUrl('/email-validation');
  }
  // Caso contrário, retorna UrlTree redirecionando para '/login'
  return router.parseUrl('/login');
};
