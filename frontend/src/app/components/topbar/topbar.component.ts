import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
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

  // Array de links del menú
  get menuItems() {
    const items = [
      { label: 'Home', link: ['/', this.routes.home] },
      { label: 'Productos', link: ['/', this.routes.products.default] },
    ];

    if (!this.isLoggedIn()) {
      items.push({ label: 'Login', link: ['/', this.routes.login] });
    }

    return items;
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private popAlertService: PopAlertService
  ) {}

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
}
