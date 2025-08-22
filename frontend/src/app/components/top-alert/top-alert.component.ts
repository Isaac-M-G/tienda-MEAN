import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { AlertService } from '../../service/alert.service';
import { Observable } from 'rxjs';
import { AlertMessage } from '../../interfaces/alert-message.interface';

@Component({
  selector: 'app-top-alert',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './top-alert.component.html',
  styleUrl: './top-alert.component.css',
})
export class TopAlertComponent {
  alert$: Observable<AlertMessage | null>;

  constructor(public alertService: AlertService) {
    this.alert$ = this.alertService.alerts$; // ✅ inicialización segura
  }
}
