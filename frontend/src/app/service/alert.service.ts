import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertMessage } from '../interfaces/alert-message.interface'; // <--- nueva ubicación

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  alerts$ = this.alertSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.alertSubject.next({ message, type });
    setTimeout(() => this.clear(), 3000); // auto-hide
  }

  clear() {
    this.alertSubject.next(null);
  }
}
