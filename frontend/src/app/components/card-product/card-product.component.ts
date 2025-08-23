import { Component, Input } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';
import { GlobalVariables } from '../../shared/global-variables';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../mini-components/button/button.component';
import { PopAlertService } from '../../service/pop-alert.service';
@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.css'],
})
export class CardProductComponent {
  isAdmin = false;
  GlobalVariables = GlobalVariables;
  
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
    private popAlertService: PopAlertService
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
      message: '¿Seguro que quieres borrar el producto?',
      confirmText: 'Sí',
      cancelText: 'No',
    });

    if (!confirmed) return;

    this.productService.deleteProduct(this.id).subscribe({
      next: async () => {
        //  eliminar la imagen en Firebase
        if (this.imageUrl) {
          await this.firebaseService.deleteImage(this.imageUrl);
        }
        this.hideCard();
      },
      error: (err) => {
        console.error('Error al borrar el producto', err);
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

  hideCard() {
    // Forma simple: marcar el card como eliminado
    this.title = '[Eliminado]';
    this.description = '';
    this.price = 0;
    this.imageUrl = '';
  }
}
