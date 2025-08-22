import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalVariables } from '../shared/global-variables';
import { jwtDecode } from 'jwt-decode';
import { AuthInfo } from '../interfaces/auth.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject(this.getUserInfo());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /** Login → pide token al backend y lo guarda en localStorage */
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.auth.login}`,
        { email, password }
      )
      .pipe(
        tap((res) => {
          // Guardar token
          localStorage.setItem(GlobalVariables.authTokenKey, res.token);

          // Actualizar observable para que los componentes sepan que hubo login
          this.userSubject.next(this.getUserInfo());
        })
      );
  }

  /** Registro de usuario */
  register(email: string, password: string, role: string) {
    return this.http.post(
      `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.auth.register}`,
      { email, password, role }
    );
  }

  /** Elimina el token al cerrar sesión */
  logout() {
    localStorage.removeItem(GlobalVariables.authTokenKey);
    this.userSubject.next(null);
  }

  /** Devuelve el token actual o null */
  getToken(): string | null {
    return localStorage.getItem(GlobalVariables.authTokenKey);
  }

  /** Devuelve true si hay un token guardado */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Extrae el userId del token JWT */
  getUserId() {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode<AuthInfo>(token);
    return decoded.userId;
  }

  /** Extrae información completa del usuario desde el token */
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
