import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { AlertService } from '../../service/alert.service';
import { GlobalVariables } from '../../shared/global-variables';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  selectedFile: File | null = null;
  productId: string | null = null;
  currentImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // Tomar id desde la URL -> /products/edit/:id
    this.productId = this.route.snapshot.paramMap.get('id');

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
    });

    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
        });
        this.currentImageUrl = product.imageUrl;
      },
      error: (err) => console.error('Error al cargar producto:', err),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.productForm.patchValue({ imageUrl: this.selectedFile.name });
    } else {
      this.selectedFile = null;
      this.productForm.patchValue({ imageUrl: '' });
    }
    this.productForm.get('imageUrl')?.updateValueAndValidity();
  }

  async submitForm() {
    this.productForm.markAllAsTouched();

    if (!this.productForm.valid || !this.productId) return;

    let imageUrl = this.currentImageUrl;

    if (this.selectedFile) {
      // ⚠️ Borrar la imagen vieja antes de subir la nueva
      if (this.currentImageUrl) {
        await this.firebaseService.deleteImage(this.currentImageUrl);
      }

      // Subir la nueva imagen
      imageUrl = await this.firebaseService.uploadImage(this.selectedFile);
    }

    const updatedProduct: Product = {
      ...this.productForm.value,
      imageUrl,
    };

    this.productService
      .updateProduct(this.productId, updatedProduct)
      .subscribe({
        next: () => {
          // Mostrar alerta
          this.alertService.show('Producto actualizado con éxito', 'success');

          this.router.navigate([GlobalVariables.appRoutes.products.default]);
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          this.alertService.show('Error al actualizar producto', 'error');
        },
      });
  }
}
