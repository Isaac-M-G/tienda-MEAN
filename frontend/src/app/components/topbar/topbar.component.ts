import {
  Component,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GlobalVariables } from '../../shared/global-variables';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PopAlertComponent } from '../pop-alert/pop-alert.component';
import { PopAlertService } from '../../service/pop-alert.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, PopAlertComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Rutas globales para usar en el template */
  routes = GlobalVariables.appRoutes;
  themes = ['theme-light', 'theme-gray', 'theme-dark'];
  currentTheme = this.themes[0];

  // Array de links del menú
  get menuItems() {
    const items = [
      { label: 'Home', link: [this.routes.home] },
      { label: 'Productos', link: [this.routes.products.default] },

      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
      // { label: 'Productos', link: ['/', this.routes.products.default] },
    ];

    if (!this.isLoggedIn()) {
      items.push({ label: 'Login', link: ['/', this.routes.login] });
    }

    return items;
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private popAlertService: PopAlertService,
    private renderer: Renderer2
  ) {
    this.applyTheme(this.currentTheme);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  async logout() {
    const confirmed = await this.popAlertService.confirm({
      message: '¿Seguro que quieres cerrar sesión?',
      confirmText: 'Sí',
      cancelText: 'No',
    });

    if (confirmed) {
      this.auth.logout();
      this.router.navigate([GlobalVariables.appRoutes.login]);
    }
  }

  nextTheme() {
    let index = this.themes.indexOf(this.currentTheme);
    index = (index + 1) % this.themes.length;
    this.currentTheme = this.themes[index];
    this.applyTheme(this.currentTheme);
  }

  private applyTheme(theme: string) {
    // Elimina cualquier clase previa de tema
    this.themes.forEach((t) =>
      this.renderer.removeClass(document.documentElement, t)
    );
    // Agrega el nuevo tema
    this.renderer.addClass(document.documentElement, theme);
  }
}
