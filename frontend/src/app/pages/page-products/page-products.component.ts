import { Component } from '@angular/core';
import { CardProductComponent } from '../../components/card-product/card-product.component';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [CardProductComponent],
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.css']
})
export class PageProductsComponent {
  productos = [
    { title: 'Laptop Gamer', description: '16GB RAM, RTX 4060', price: 1500, imageUrl: 'https://via.placeholder.com/250x150' },
    { title: 'Mouse Inalámbrico', description: 'Ergonómico y recargable', price: 25, imageUrl: 'https://via.placeholder.com/250x150' },
    { title: 'Teclado Mecánico', description: 'Switches rojos', price: 80, imageUrl: 'https://via.placeholder.com/250x150' }
  ];
}
