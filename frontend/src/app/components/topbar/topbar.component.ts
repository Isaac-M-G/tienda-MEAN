import { Component, EventEmitter, Output } from '@angular/core';
import { GlobalVariables } from '../../shared/global-variables';
import { AuthService } from '../../service/auth.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Rutas globales para usar en el template */
  routes = GlobalVariables.appRoutes;

  constructor(private auth: AuthService) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
  }
}
