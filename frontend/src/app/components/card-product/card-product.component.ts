import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [],
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.css']
})
export class CardProductComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: number = 0;
  @Input() imageUrl: string = '';
}
