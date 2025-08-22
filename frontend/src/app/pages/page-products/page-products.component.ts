import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from '../../service/product.service';
import { AuthService } from '../../service/auth.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [SharedModule],
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
