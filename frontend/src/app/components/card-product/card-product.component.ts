import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from '../../service/product.service';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.css'],
})
export class CardProductComponent {
  @Input() id!: string;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: number = 0;
  @Input() imageUrl: string = '';

  constructor(
    private productService: ProductService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  onDelete() {
    if (!this.id) {
      console.error('No se proporcionó id del producto');
      return;
    }

    this.productService.deleteProduct(this.id).subscribe({
      next: async () => {
        console.log(`Producto con id ${this.id} borrado`);

        // 🗑️ También eliminar la imagen en Firebase
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
    this.router.navigate(['/products/edit', this.id]);
  }

  hideCard() {
    // Forma simple: marcar el card como eliminado
    this.title = '[Eliminado]';
    this.description = '';
    this.price = 0;
    this.imageUrl = '';
  }
}
