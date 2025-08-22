// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { GlobalVariables } from '../shared/global-variables';

/**
 * Interceptor funcional que añade el token a cada request.
 *
 * - Si existe un token en localStorage, lo añade en el header Authorization
 * - Si no existe, deja pasar la request sin modificarla
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token usando la key global
  const token = localStorage.getItem(GlobalVariables.authTokenKey);

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
