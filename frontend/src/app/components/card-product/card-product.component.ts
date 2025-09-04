import { Component, Input } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';
import { GlobalVariables } from '../../shared/global-variables';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../mini-components/button/button.component';
import { PopAlertService } from '../../service/pop-alert.service';
import { AlertService } from '../../service/alert.service';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { Product } from '../../interfaces/product.interface';
@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AddToCartComponent],
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.css'],
})
export class CardProductComponent {
  isAdmin = false;
  GlobalVariables = GlobalVariables;
  isHidden = false; // Nueva propiedad para controlar visibilidad

  @Input() id!: string;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() category: string | null = null;
  @Input() price: number = 0;
  @Input() imageUrl: string = '';

  constructor(
    private productService: ProductService,
    private firebaseService: FirebaseService,
    private router: Router,
    private authService: AuthService,
    private popAlertService: PopAlertService,
    private alertService: AlertService
  ) {
    const user = this.authService.getUserInfo();
    this.isAdmin = user?.role === 'admin';
  }

  async onDelete() {
    if (!this.id) {
      console.error('No se proporcionó id del producto');
      return;
    }

    const confirmed = await this.popAlertService.confirm({
      message: '¿Seguro que quieres eliminar este producto?',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.productService.deleteProduct(this.id).subscribe({
      next: async () => {
        console.log(`Producto con id ${this.id} borrado`);

        // Eliminar la imagen en Firebase
        if (this.imageUrl) {
          await this.firebaseService.deleteImage(this.imageUrl);
        }

        // Mostrar mensaje de éxito
        this.alertService.show('Producto eliminado correctamente', 'success');
        
        // Ocultar la tarjeta sin mostrar "[Eliminado]"
        this.hideCard();
      },
      error: (err) => {
        console.error('Error al borrar el producto', err);
        this.alertService.show('Error al eliminar el producto', 'error');
      },
    });
  }

  onEdit() {
    if (!this.id) {
      console.error('No se proporcionó id del producto');
      return;
    }
    // Navegar a la ruta de edición
    this.router.navigate([GlobalVariables.appRoutes.products.edit(this.id)]);
  }

  goToDetail() {
    if (!this.id) {
      console.error('No se proporcionó id del producto');
      return;
    }
    this.router.navigate([GlobalVariables.appRoutes.products.details(this.id)]);
  }

  hideCard() {
    // Ocultar completamente la tarjeta
    this.isHidden = true;
  }

  getProduct(): Product {
    return {
      _id: this.id,
      name: this.title,
      description: this.description,
      price: this.price,
      imageUrl: this.imageUrl,
      category: this.category as 'audifonos' | 'monitores' | 'teclados' | 'cables' | null
    };
  }
}
