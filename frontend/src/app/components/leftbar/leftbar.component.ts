import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { GlobalVariables } from '../../shared/global-variables';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-leftbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

    // Detecta rol del usuario
    const user = this.auth.getUserInfo();
    this.isAdmin = user?.role === 'admin';
  }

  private updateMenuItems() {
    // Si estás en login o register → solo mostrar Home
    if (
      this.currentUrl.includes('/' + this.routes.login) ||
      this.currentUrl.includes('/' + this.routes.register)
    ) {
      console.log('esta cosa esta en login o register');
      this.menuItems = [{ label: 'Home', link: this.routes.home }];
      return;
    }

    console.log('esta cosa no esta en login o register');
    // En cualquier otra ruta → mostrar el menú completo
    this.menuItems = [
      { label: 'Dashboard', link: this.routes.dashboard },
      { label: 'Productos', link: this.routes.products.default },
      { label: 'Login', link: this.routes.login },
      { label: 'Registro', link: this.routes.register },
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
