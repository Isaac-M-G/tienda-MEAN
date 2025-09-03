import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { AlertService } from '../../service/alert.service';
import { GlobalVariables } from '../../shared/global-variables';
import { Product } from '../../interfaces/product.interface';
import { PopAlertService } from '../../service/pop-alert.service';
import { FormComponent, FormField } from '../form/form.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../mini-components/input/input.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [FormComponent, CommonModule, InputComponent],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  productId: string | null = null;
  selectedFile: File | null = null;
  currentImageUrl: string = '';

  formFields: FormField[] = [
    {
      name: 'name',
      label: 'Título',
      type: 'text',
      placeholder: 'Ingresa el título',
      validators: [Validators.required],
      errorMessages: { required: 'El título es obligatorio.' },
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      placeholder: 'Ingresa la descripción',
      validators: [Validators.required],
      errorMessages: { required: 'La descripción es obligatoria.' },
    },
    {
      name: 'price',
      label: 'Precio',
      type: 'number',
      placeholder: 'Ingresa el precio',
      validators: [Validators.required, Validators.min(0)],
      errorMessages: {
        required: 'El precio es obligatorio.',
        min: 'El precio debe ser mayor o igual a 0.',
      },
    },
    {
      name: 'imageUrl',
      label: 'Imagen',
      type: 'file',
      placeholder: 'Selecciona una imagen',
      validators: [],
      errorMessages: { required: 'Debes seleccionar una imagen.' },
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      options: GlobalVariables.productCategories.map((cat) => ({
        value: cat,
        label: cat,
      })),
    },
  ];

  constructor(
    private productService: ProductService,
    private firebaseService: FirebaseService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private popAlertService: PopAlertService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  // Agregar este método
  onFormReady(formGroup: FormGroup) {
    this.form = formGroup;

    if (this.productId) {
      this.loadProduct(this.productId);
    }

    // Escuchar cambios del campo imageUrl
    this.form.get('imageUrl')?.valueChanges.subscribe((file: File | null) => {
      this.selectedFile = file;
      console.log('Archivo seleccionado:', file);
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        if (!product) {
          this.router.navigate([GlobalVariables.appRoutes.notFound]);
          return;
        }

        // Solo hacer patch si el form ya existe
        if (this.form) {
          this.form.patchValue({
            ...product,
            imageUrl: null, // Para que el input file no muestre nombre
          });
        }

        this.currentImageUrl = product.imageUrl;
      },
      error: (err) => console.error('Error al cargar producto:', err),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const control = this.form.get('imageUrl');

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      control?.setValue(this.selectedFile);
    } else {
      this.selectedFile = null;
      control?.setValue(null);
    }
  }

  async onSubmit(formValue: any) {
    if (!this.productId) return;

    let imageUrl = this.currentImageUrl;

    // ⚡ Usar siempre selectedFile si existe
    if (this.selectedFile) {
      // eliminar antigua si existe
      if (this.currentImageUrl) {
        await this.firebaseService.deleteImage(this.currentImageUrl);
        console.log('Imagen antigua eliminada:', this.currentImageUrl);
      }

      // subir nueva imagen
      imageUrl = await this.firebaseService.uploadImage(this.selectedFile);
    }

    const updatedProduct: Product = {
      ...formValue,
      imageUrl, // la nueva o la antigua si no hay cambio
      category: formValue.category || null,
    };

    this.productService
      .updateProduct(this.productId, updatedProduct)
      .subscribe({
        next: () => {
          this.alertService.show('Producto actualizado con éxito', 'success');

          // reset selectedFile para futuros cambios
          this.selectedFile = null;

          // opcional: actualizar currentImageUrl para reflejar la nueva imagen
          this.currentImageUrl = imageUrl;

          // this.router.navigate([GlobalVariables.appRoutes.products.default]);
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          this.alertService.show('Error al actualizar producto', 'error');
        },
      });
  }

  onCancel() {
    this.router.navigate([GlobalVariables.appRoutes.products.default]);
  }
}
