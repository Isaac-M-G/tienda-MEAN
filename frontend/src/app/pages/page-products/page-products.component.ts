import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { CommonModule } from '@angular/common';
import { FilterSearchComponent } from '../../mini-components/filter-search/filter-search.component';
import { GlobalVariables } from '../../shared/global-variables';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [
    ProductFormComponent,
    CardProductComponent,
    CommonModule,
    FilterSearchComponent,
  ],
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.css'],
})
export class PageProductsComponent implements OnInit {
  GlobalVariables = GlobalVariables;
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

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

  onProductsFiltered(filtered: Product[]) {
    this.filteredProducts = filtered;
  }
}
