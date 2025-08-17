import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from '../../service/product.service';
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
  
  constructor(private productService: ProductService) {}

  onDelete() {
    if (!this.id) {
      console.error('No se proporcionó id del producto');
      return;
    }

    this.productService.deleteProduct(this.id).subscribe({
      next: () => {
        console.log(`Producto con id ${this.id} borrado`);
        // ⚠️ Aquí podrías ocultar el card del DOM:
        this.hideCard();
      },
      error: (err) => {
        console.error('Error al borrar el producto', err);
      },
    });
  }

  hideCard() {
    // Forma simple: marcar el card como eliminado
    this.title = '[Eliminado]';
    this.description = '';
    this.price = 0;
    this.imageUrl = '';
  }
}
