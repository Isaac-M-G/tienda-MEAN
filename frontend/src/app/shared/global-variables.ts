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
      create: 'products/create',
      editBase: 'products/edit', // parte fija de la ruta dinámica
      edit: (id: string) => `products/edit/${id}`, // ruta completa con id
      default: '',
    },
  },

  /** Endpoints del backend (API)  debe coincidir con los del backend */
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

  productCategories: ['audifonos', 'monitores', 'teclados', 'cables'],

  roles: ['user', 'admin'], // debe coincidir con los roles en el backend

  /** Íconos globales */
  icons: {
    delete: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>`,
    create: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>`,
    headphones: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M160 288C160 199.6 231.6 128 320 128C408.4 128 480 199.6 480 288L480 325.5C470 322 459.2 320 448 320L432 320C405.5 320 384 341.5 384 368L384 496C384 522.5 405.5 544 432 544L448 544C501 544 544 501 544 448L544 288C544 164.3 443.7 64 320 64C196.3 64 96 164.3 96 288L96 448C96 501 139 544 192 544L208 544C234.5 544 256 522.5 256 496L256 368C256 341.5 234.5 320 208 320L192 320C180.8 320 170 321.9 160 325.5L160 288z"/></svg>`,
  },
};
