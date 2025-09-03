import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { CommonModule } from '@angular/common';
import { FilterSearchComponent } from '../../components/filter-search/filter-search.component';
import { GlobalVariables } from '../../shared/global-variables';
import { FormComponent, FormField } from '../../components/form/form.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [
    ProductFormComponent,
    CardProductComponent,
    CommonModule,
    FilterSearchComponent,
    FormComponent,
  ],
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.css'],
})
export class PageProductsComponent implements OnInit {
  onSubmit(values: any) {
    console.log('Formulario válido:', values);
  }

  onCancel() {
    console.log('Formulario cancelado');
  }

  globalVariables = GlobalVariables;
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  // Guardar resultados parciales de cada filtro
  filterResults: { [key: string]: Product[] } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.allProducts = res;
        this.filteredProducts = [...res];
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  // Recibe el resultado de un filtro y su identificador
  onProductsFiltered(filtered: Product[], filterId: string) {
    this.filterResults[filterId] = filtered;

    // Intersectar todos los filtros activos
    let results = [...this.allProducts];
    for (const key in this.filterResults) {
      const f = this.filterResults[key];

      // Aplicar AND para todos, incluso si el array está vacío
      if (f) {
        results = results.filter((p) => f.includes(p));
      }
    }

    this.filteredProducts = results;
  }
}
