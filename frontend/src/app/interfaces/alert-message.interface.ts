/** Interfaz con los datos que devuelve el token */
export interface AlertMessage {
  type: 'success' | 'error';
  message: string;
}