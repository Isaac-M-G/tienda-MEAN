// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional que añade el token a cada request.
 * 
 * - Si existe un token en localStorage, lo añade en el header Authorization
 * - Si no existe, deja pasar la request sin modificarla
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
