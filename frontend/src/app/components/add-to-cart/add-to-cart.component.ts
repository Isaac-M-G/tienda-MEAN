import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { Product } from '../../interfaces/product.interface';
import { ButtonComponent } from '../../mini-components/button/button.component';
import { InputComponent } from '../../mini-components/input/input.component';
import { AlertService } from '../../service/alert.service';
import { GlobalVariables } from '../../shared/global-variables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent {
  @Input() product!: Product;
  
  quantity: number = 1;
  isAdding: boolean = false;
  isLoggedIn: boolean = false;
  globalVariables = GlobalVariables;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  increaseQuantity(): void {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    // Asegurar que sea un número válido
    if (isNaN(this.quantity) || this.quantity < 1) {
      this.quantity = 1;
    } else if (this.quantity > 99) {
      this.quantity = 99;
    }
    // Redondear en caso de decimales
    this.quantity = Math.floor(this.quantity);
  }

  async addToCart(): Promise<void> {
    if (!this.product || this.isAdding) {
      return;
    }

    this.isAdding = true;

    try {
      const success = this.cartService.addToCart(this.product, this.quantity);
      
      if (success) {
        this.alertService.show(`${this.product.name} agregado al carrito (${this.quantity} unidades)`, 'success');
        
        // Resetear cantidad después de agregar
        this.quantity = 1;
      } else {
        this.alertService.show('Debes iniciar sesión para agregar productos al carrito', 'error');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      this.alertService.show('Error al agregar el producto al carrito', 'error');
    } finally {
      this.isAdding = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
