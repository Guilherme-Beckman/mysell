import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true', // Sempre presente
  };

  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  const authReq = req.clone({
    setHeaders: headers,
  });

  return next(authReq);
};
