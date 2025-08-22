import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductService, Product } from '../../service/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { CardProductComponent } from '../../components/card-product/card-product.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [SharedModule, ProductFormComponent, CardProductComponent],
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.css'],
})
export class PageProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        // console.log('Productos cargados:', res);
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }
}
