import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariables } from '../shared/global-variables';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  /** Obtiene todos los productos */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.products.all}`
    );
  }

  /** Obtiene un producto por su ID */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(
      `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.products.byId(
        id
      )}`
    );
  }

  /** Crea un nuevo producto */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.products.all}`,
      product
    );
  }

  /** Actualiza un producto existente */
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.products.byId(
        id
      )}`,
      product
    );
  }

  /** Elimina un producto */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(
      `${GlobalVariables.apiUrl}/${GlobalVariables.apiEndpoints.products.byId(
        id
      )}`
    );
  }
}
