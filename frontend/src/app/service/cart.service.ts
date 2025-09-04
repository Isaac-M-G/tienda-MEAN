import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Cart } from '../interfaces/cart.interface';
import { Product } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.getEmptyCart());
  public cart$ = this.cartSubject.asObservable();

  constructor(private authService: AuthService) {
    // Cargar carrito del localStorage al inicializar
    this.loadCart();
    
    // Suscribirse a cambios de usuario para limpiar carrito si no hay usuario
    this.authService.user$.subscribe(user => {
      if (!user) {
        this.clearCart();
      } else {
        this.loadCart();
      }
    });
  }

  private getEmptyCart(): Cart {
    return {
      userId: '',
      items: [],
      total: 0,
      itemCount: 0
    };
  }

  private loadCart(): void {
    const user = this.authService.getUserInfo();
    if (!user) {
      this.cartSubject.next(this.getEmptyCart());
      return;
    }

    const cartKey = `cart_${user.id}`;
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        const cart: Cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        this.cartSubject.next(this.getEmptyCart());
      }
    } else {
      this.cartSubject.next({
        ...this.getEmptyCart(),
        userId: user.id
      });
    }
  }

  private saveCart(cart: Cart): void {
    if (cart.userId) {
      const cartKey = `cart_${cart.userId}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }

  private calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  }

  addToCart(product: Product, quantity: number = 1): boolean {
    const user = this.authService.getUserInfo();
    if (!user) {
      return false; // Usuario no autenticado
    }

    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      item => item.product._id === product._id
    );

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Actualizar cantidad del producto existente
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        subtotal: (updatedItems[existingItemIndex].quantity + quantity) * product.price
      };
    } else {
      // Agregar nuevo producto
      const newItem: CartItem = {
        product,
        quantity,
        subtotal: quantity * product.price
      };
      updatedItems = [...currentCart.items, newItem];
    }

    const { total, itemCount } = this.calculateCartTotals(updatedItems);

    const updatedCart: Cart = {
      userId: user.id,
      items: updatedItems,
      total,
      itemCount
    };

    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
    return true;
  }

  removeFromCart(productId: string): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(
      item => item.product._id !== productId
    );

    const { total, itemCount } = this.calculateCartTotals(updatedItems);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      total,
      itemCount
    };

    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.map(item => {
      if (item.product._id === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.product.price
        };
      }
      return item;
    });

    const { total, itemCount } = this.calculateCartTotals(updatedItems);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      total,
      itemCount
    };

    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
  }

  clearCart(): void {
    const user = this.authService.getUserInfo();
    const emptyCart = user ? { ...this.getEmptyCart(), userId: user.id } : this.getEmptyCart();
    
    this.cartSubject.next(emptyCart);
    
    if (user) {
      const cartKey = `cart_${user.id}`;
      localStorage.removeItem(cartKey);
    }
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    return this.cartSubject.value.itemCount;
  }

  getCartTotal(): number {
    return this.cartSubject.value.total;
  }
}
