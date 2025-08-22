import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../topbar/topbar.component';
import { LeftbarComponent } from '../leftbar/leftbar.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, LeftbarComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  showTopbar = true;
  showLeftbar = true;
  canToggleLeftbar = true;

  private hideTopbarRoutes: string[] = ['/login', '/register'];
  private hideLeftbarRoutes: string[] = [
    '/login',
    '/register',
    '/products/edit',
  ];

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
