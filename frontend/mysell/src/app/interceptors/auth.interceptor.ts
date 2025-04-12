import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return next(authReq);
    }
  }
  return next(req);
};
