/** Interfaz con los datos que devuelve el token */
export interface AuthInfo {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
