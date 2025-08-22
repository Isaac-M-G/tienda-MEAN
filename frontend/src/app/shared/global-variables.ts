import { environment } from '../enviroment/environment';

export const GlobalVariables = {
  /** URL base del backend */
  apiUrl: 'http://localhost:3000',

  /** Llave usada en localStorage para guardar el token */
  authTokenKey: 'authToken',

  /** Rutas internas de navegación (frontend) */
  appRoutes: {
    home: '',
    login: 'login',
    register: 'register',
    dashboard: 'dashboard',

    /** Rutas de productos */
    products: {
      editBase: 'products/edit', // parte fija de la ruta dinámica
      edit: (id: string) => `products/edit/${id}`, // ruta completa con id
      default: '',
    },
  },

  /** Endpoints del backend (API) */
  apiEndpoints: {
    auth: {
      login: 'auth/login',
      register: 'auth/register',
    },
    products: {
      all: 'products',
      byId: (id: string) => `products/${id}`,
      defaultFolder: 'products', // carpeta por defecto para Firebase
    },
  },

  /** Configuración de Firebase Storage */
  firebaseStorageBaseUrl: `https://firebasestorage.googleapis.com/v0/b/${environment.firebase.storageBucket}/o/`,
};
