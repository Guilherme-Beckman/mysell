import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const authReq = req.clone({
      setHeaders: headers,
    });

    return next(authReq);
  }

  return next(req);
};
