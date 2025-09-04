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
  template: `
    <div class="flex items-center gap-2">
      <!-- Selector de cantidad -->
      <div class="flex items-center border rounded-lg overflow-hidden" 
           style="border-color: var(--cart-border); background-color: var(--cart-item-bg);">
        <app-button
          (click)="decreaseQuantity()"
          [customSvg]="globalVariables.icons.minus"
          iconSize="16"
          bgColor="var(--cart-hover-bg)"
          textColor="var(--cart-text)"
          hoverBgColor="var(--cart-border)"
          padding="px-3 py-2"
          [disabled]="quantity <= 1"
        >
        </app-button>
        
        <app-input
          [(ngModel)]="quantity"
          type="number"
          [placeholder]="'1'"
          padding="px-2 py-1"
          borderColor="transparent"
          bgColor="transparent"
          textColor="var(--cart-text)"
          fontSize="14px"
          class="w-16 text-center"
          (inputEvent)="validateQuantity()"
        >
        </app-input>
        
        <app-button
          (click)="increaseQuantity()"
          [customSvg]="globalVariables.icons.plus"
          iconSize="16"
          bgColor="var(--cart-hover-bg)"
          textColor="var(--cart-text)"
          hoverBgColor="var(--cart-border)"
          padding="px-3 py-2"
          [disabled]="quantity >= 99"
        >
        </app-button>
      </div>

      <!-- Botón agregar al carrito -->
      <app-button
        *ngIf="isLoggedIn"
        (click)="addToCart()"
        [customSvg]="globalVariables.icons.shoppingBag"
        label="Agregar al carrito"
        iconSize="18"
        bgColor="var(--cart-button-add)"
        textColor="white"
        hoverBgColor="var(--cart-button-primary)"
        [disabled]="isAdding"
        padding="px-4 py-2"
      >
      </app-button>

      <!-- Botón para usuarios no autenticados -->
      <app-button
        *ngIf="!isLoggedIn"
        (click)="goToLogin()"
        [customSvg]="globalVariables.icons.login"
        label="Inicia sesión para comprar"
        iconSize="18"
        bgColor="var(--cart-button-primary)"
        textColor="white"
        hoverBgColor="var(--primary)"
        padding="px-4 py-2"
      >
      </app-button>
    </div>
  `,
  styles: [`
    /* Estilos específicos para ocultar controles de número en el input */
    ::ng-deep input[type="number"]::-webkit-outer-spin-button,
    ::ng-deep input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    ::ng-deep input[type="number"] {
      -moz-appearance: textfield;
    }
  `]
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
