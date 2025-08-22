import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, ProductFormComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {}
