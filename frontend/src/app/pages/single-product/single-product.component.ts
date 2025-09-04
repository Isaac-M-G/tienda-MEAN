import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { GlobalVariables } from '../../shared/global-variables';
import { ButtonComponent } from '../../mini-components/button/button.component';
import { AddToCartComponent } from '../../components/add-to-cart/add-to-cart.component';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AddToCartComponent],
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css'],
})
export class SingleProductComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (res) => {
          if (res) {
            this.product = res;
          } else {
            this.router.navigate([GlobalVariables.appRoutes.notFound]);
          }
        },
        error: () => {
          // 👇 En caso de error (ej. 404 desde el backend)
          this.router.navigate([GlobalVariables.appRoutes.notFound]);
        },
      });
    } else {
      this.router.navigate([GlobalVariables.appRoutes.notFound]);
    }
  }

  goBack() {
    this.router.navigate([GlobalVariables.appRoutes.products.default]);
  }
}
