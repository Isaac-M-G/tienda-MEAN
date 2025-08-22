import { Component, EventEmitter, Output } from '@angular/core';
import { PopAlertData } from '../../interfaces/pop-alert.interface';
import { CommonModule } from '@angular/common';
import { PopAlertOptions, PopAlertService } from '../../service/pop-alert.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pop-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-alert.component.html',
  styleUrl: './pop-alert.component.css',
})
export class PopAlertComponent {
  alert$: Observable<PopAlertOptions | null>;

  constructor(private popAlertService: PopAlertService) {
    this.alert$ = this.popAlertService.alerts$;
  }

  confirm(alert: PopAlertOptions) {
    this.popAlertService.decision(true);
  }

  cancel(alert: PopAlertOptions) {
    this.popAlertService.decision(false);
  }
}
