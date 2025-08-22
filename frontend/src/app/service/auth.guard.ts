import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

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
    const token = localStorage.getItem('authToken'); // Debe coincidir con AuthService

    if (!token) {
      this.router.navigate(['/login']); // Si no hay token → login
      return false;
    }
    return true; // Hay token → permite acceso
  }
}
