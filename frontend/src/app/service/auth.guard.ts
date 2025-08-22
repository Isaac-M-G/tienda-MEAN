import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalVariables } from '../shared/global-variables';

/**
 * Guard de autenticación.
 *
 * - Se ejecuta antes de cargar rutas protegidas.
 * - Verifica si existe un token en localStorage.
 * - Si no existe, redirige al login y bloquea el acceso.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem(GlobalVariables.authTokenKey); // <-- key global

    if (!token) {
      this.router.navigate([GlobalVariables.appRoutes.login]); // <-- ruta global
      return false;
    }
    return true; // Hay token → permite acceso
  }
}
