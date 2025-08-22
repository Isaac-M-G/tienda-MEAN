import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { TopAlertComponent } from '../top-alert/top-alert.component';
import { AlertService } from '../../service/alert.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [TopAlertComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private firebaseService: FirebaseService,
    private alertService: AlertService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: [null], 
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.productForm.patchValue({ imageUrl: this.selectedFile.name });
    } else {
      // No se seleccionó ningún archivo
      this.selectedFile = null;
      this.productForm.patchValue({ imageUrl: '' });
    }
    this.productForm.get('imageUrl')?.updateValueAndValidity();
  }

  async submitForm() {
    this.productForm.markAllAsTouched();

    if (!this.productForm.valid) return;

    let imageUrl = '';
    if (this.selectedFile) {
      imageUrl = await this.firebaseService.uploadImage(this.selectedFile);
    }

    const product: Product = { ...this.productForm.value, imageUrl };

    this.productService.createProduct(product).subscribe({
      next: () => {
        this.productForm.reset();
        this.selectedFile = null;
        // Mostrar alerta
        this.alertService.show('Producto creado con éxito', 'success');
      },
      error: (err) => console.error('Error al crear producto:', err),
    });
  }
}
