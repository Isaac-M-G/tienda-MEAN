import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PopAlertOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class PopAlertService {
  private alertSubject = new BehaviorSubject<PopAlertOptions | null>(null);
  alerts$ = this.alertSubject.asObservable();

  private resolveFn?: (confirmed: boolean) => void;

  confirm(options: PopAlertOptions): Promise<boolean> {
    this.alertSubject.next(options);

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  decision(confirmed: boolean) {
    if (this.resolveFn) {
      this.resolveFn(confirmed);
      this.resolveFn = undefined;
    }
    this.alertSubject.next(null); // cerrar el pop
  }
}
