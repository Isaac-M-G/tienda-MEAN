import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { GlobalVariables } from '../../shared/global-variables';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leftbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leftbar.component.html',
  styleUrl: './leftbar.component.css',
})
export class LeftbarComponent implements OnInit {
  routes = GlobalVariables.appRoutes;
  currentUrl: string = '';
  isAdmin: boolean = false;

  menuItems: { label: string; link: string; adminOnly?: boolean }[] = [];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    // Detecta cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
        this.updateMenuItems();
      });

    // Detecta cambios de usuario
    this.auth.user$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
      this.updateMenuItems();
    });
  }

  private updateMenuItems() {
    // Si estás en login o register → solo mostrar Home
    if (
      this.currentUrl.includes('/' + this.routes.login) ||
      this.currentUrl.includes('/' + this.routes.register)
    ) {
      this.menuItems = [{ label: 'Home', link: this.routes.home }];
      return;
    }

    // En cualquier otra ruta → mostrar este menú
    this.menuItems = [
      { label: 'Productos', link: this.routes.products.default },

      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },
      // { label: 'Productos', link: this.routes.products.default },

      {
        label: 'Crear Producto',
        link: this.routes.products.create,
        adminOnly: true,
      },
    ];

    // Filtrar adminOnly si fuera necesario
    if (!this.isAdmin) {
      this.menuItems = this.menuItems.filter((item) => !item.adminOnly);
    }
  }

  isActive(link: string): boolean {
    return this.currentUrl.startsWith('/' + link);
  }
}
