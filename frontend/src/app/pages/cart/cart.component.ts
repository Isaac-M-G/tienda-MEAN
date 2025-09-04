import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { Cart, CartItem } from '../../interfaces/cart.interface';
import { ButtonComponent } from '../../mini-components/button/button.component';
import { InputComponent } from '../../mini-components/input/input.component';
import { AlertService } from '../../service/alert.service';
import { GlobalVariables } from '../../shared/global-variables';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    userId: '',
    items: [],
    total: 0,
    itemCount: 0
  };
  
  isLoggedIn: boolean = false;
  globalVariables = GlobalVariables;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado del carrito
    const cartSub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    this.subscriptions.push(cartSub);

    // Suscribirse al estado de autenticación
    const authSub = this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.alertService.show('Producto eliminado del carrito', 'success');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.alertService.show('Carrito vacío', 'success');
  }

  goToProducts(): void {
    this.router.navigate(['/']);
  }

  goToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  checkout(): void {
    // Por ahora solo mostramos un mensaje
    this.alertService.show('Función de checkout no implementada aún', 'error');
  }

  onQuantityChange(productId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);
    if (newQuantity > 0 && newQuantity <= 99) {
      this.updateQuantity(productId, newQuantity);
    }
  }

  get hasItems(): boolean {
    return this.cart.items.length > 0;
  }

  get formattedTotal(): string {
    return this.cart.total.toFixed(2);
  }

  trackByProductId(index: number, item: CartItem): string {
    return item.product._id || '';
  }
}
