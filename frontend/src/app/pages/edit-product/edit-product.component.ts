import { Component } from '@angular/core';
import { ProductEditComponent } from '../../components/product-edit/product-edit.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductEditComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent {}
