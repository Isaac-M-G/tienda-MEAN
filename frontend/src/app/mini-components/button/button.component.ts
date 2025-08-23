import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlobalVariables } from '../../shared/global-variables';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() type: 'delete' | 'create' | 'edit' | undefined;
  @Input() label?: string;
  @Input() bgColor?: string;
  @Input() textColor?: string;
  @Input() padding: string = 'px-4 py-2';
  @Input() customSvg?: string;
  @Input() fontSize?: string;
  @Input() iconSize?: string;

  hover = false;

  constructor(private sanitizer: DomSanitizer) {}

  get background(): string {
    if (this.bgColor) return this.bgColor;
    switch (this.type) {
      case 'delete':
        return '#ef4444';
      case 'create':
        return '#22c55e';
      case 'edit':
        return '#3b82f6';
      default:
        return '#e5e7eb';
    }
  }

  get color(): string {
    return this.textColor ?? '#ffffff';
  }

  get font(): string {
    return this.fontSize ?? '14px';
  }

  get icon(): SafeHtml | null {
    const raw =
      this.customSvg ?? (this.type ? GlobalVariables.icons[this.type] : null);
    if (!raw) return null;

    const size = this.iconSize ?? this.fontSize ?? '20px';
    const color = this.color; // toma el textColor

    // agrega width, height y fill
    const styledSvg = raw.replace(
      /<svg /,
      `<svg width="${size}" height="${size}" fill="${color}" `
    );

    return this.sanitizer.bypassSecurityTrustHtml(styledSvg);
  }

  hoverColor(hex: string, alpha = 0.8): string {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.startsWith('#')) {
      const h = hex.substring(1);
      if (h.length === 3) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else if (h.length === 6) {
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
      }
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
