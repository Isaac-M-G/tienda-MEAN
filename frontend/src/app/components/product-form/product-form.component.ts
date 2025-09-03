import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { GlobalVariables } from '../../shared/global-variables';
import { Product } from '../../interfaces/product.interface';
import { PopAlertService } from '../../service/pop-alert.service';
import { FormComponent, FormField } from '../form/form.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  selectedFile: File | null = null;
  form!: FormGroup;

  // Definición de campos usando FormField
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
      type: 'file', // <-- ahora sí podemos usar 'file'
      placeholder: 'Selecciona una imagen',
      validators: [Validators.required],
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
    private popAlertService: PopAlertService
  ) {}

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
    const selectedFile: File = formValue.imageUrl;
    let imageUrl = '';

    if (selectedFile) {
      imageUrl = await this.firebaseService.uploadImage(selectedFile);
    }

    const product: Product = { ...formValue, imageUrl };
    // Si la categoría no está definida, establecerla como null
    if (!product.category) {
      product.category = null;
    }
    this.productService.createProduct(product).subscribe({
      next: async () => {
        // Resetear form
        this.selectedFile = null;

        this.alertService.show('Producto creado con éxito', 'success');

        // const confirmed = await this.popAlertService.confirm({
        //   message: '¿Quieres crear otro producto?',
        //   confirmText: 'Sí',
        //   cancelText: 'No',
        // });

        // if (!confirmed) {
        //   this.router.navigate([GlobalVariables.appRoutes.products.default]);
        // }
      },
      error: (err) => console.error('Error al crear producto:', err),
    });
  }

  onCancel() {
    this.router.navigate([GlobalVariables.appRoutes.products.default]);
  }
}
