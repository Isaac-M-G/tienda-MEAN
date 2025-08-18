import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-top-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-alert.component.html',
  styleUrl: './top-alert.component.css',
})
export class TopAlertComponent {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message: string = '';
  visible: boolean = false;

  close() {
    this.visible = false;
  }

  show(message: string, type: 'success' | 'error' = 'success') {
    this.message = message;
    this.type = type;
    this.visible = true;

    // Auto-hide después de 3 segundos
    setTimeout(() => (this.visible = false), 3000);
  }
}
