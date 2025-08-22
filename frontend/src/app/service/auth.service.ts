import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlobalVariables } from '../shared/global-variables';
import { jwtDecode } from 'jwt-decode';
import { AuthInfo } from '../interfaces/auth.interface';

/**
 * Servicio de autenticación.
 *
 * - Maneja login y registro
 * - Guarda y elimina el token en localStorage
 * - Expone utilidades como isLoggedIn() y getUserId()
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = GlobalVariables.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  /** Login → pide token al backend y lo guarda en localStorage */
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token); // Guardamos el token
        })
      );
  }

  /** Elimina el token al cerrar sesión */
  logout() {
    localStorage.removeItem('token');
  }

  /** Devuelve el token actual o null */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Devuelve true si hay un token guardado */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Registro de usuario */
  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  /** Extrae el userId del token JWT */
  getUserId() {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode<AuthInfo>(token);

    return decoded.userId;
  }

  getUserInfo() {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode<AuthInfo>(token);

    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  }
}
