import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { GlobalVariables } from '../../shared/global-variables';
import { TopbarComponent } from '../topbar/topbar.component';
import { LeftbarComponent } from '../leftbar/leftbar.component';
import { CommonModule } from '@angular/common';
import { TopAlertComponent } from '../top-alert/top-alert.component';
import { PopAlertComponent } from '../pop-alert/pop-alert.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, LeftbarComponent, CommonModule, TopAlertComponent, PopAlertComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  showTopbar = true;
  showLeftbar = true;
  canToggleLeftbar = true;

  private hideTopbarRoutes: string[] = [
    // '/' + GlobalVariables.appRoutes.login,
    // '/' + GlobalVariables.appRoutes.register,
  ];

  private hideLeftbarRoutes: string[] = [
    '/' + GlobalVariables.appRoutes.login,
    '/' + GlobalVariables.appRoutes.register,
    '/' + GlobalVariables.appRoutes.products.editBase,
  ];

  /**
   * Cambia los bar que se muestran según la ruta actual
   */
  constructor(private router: Router, private auth: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;

        this.showTopbar = !this.hideTopbarRoutes.some((route) =>
          currentUrl.startsWith(route)
        );

        this.showLeftbar = !this.hideLeftbarRoutes.some((route) =>
          currentUrl.startsWith(route)
        );
      }
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.getUserInfo();
      console.log(`✅ Sesión activa.`);
      console.log(`ID: ${user?.id}`);
      console.log(`Email: ${user?.email}`);
      console.log(`Rol: ${user?.role}`);
    } else {
      console.log('⚠️ Aún no has iniciado sesión.');
    }
  }

  toggleSidebar() {
    this.showLeftbar = !this.showLeftbar;
  }
}
