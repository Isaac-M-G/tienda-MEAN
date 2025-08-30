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
  @Input() type: 'delete' | 'create' | 'edit' | 'goBack' | undefined;
  @Input() label?: string;
  @Input() bgColor?: string;
  @Input() textColor?: string;
  @Input() padding: string = 'px-4 py-2';
  @Input() customSvg?: string;
  @Input() fontSize?: string;
  @Input() iconSize?: string;
  @Input() bgBlack: boolean = false;

  hover = false;

  constructor(private sanitizer: DomSanitizer) {}

  get background(): string {
    if (this.bgColor) return this.bgColor;

    switch (this.type) {
      case 'delete':
        return 'var(--button-delete)';
      case 'create':
        return 'var(--button)';
      case 'edit':
        return 'var(--button-edit)';
      case 'goBack':
        return 'var(--button-edit)';
      default:
        return 'var(--button)';
    }
  }

  get color(): string {
    if (this.bgBlack) {
      return '#ffffff';
    }
    return this.textColor ?? 'var(--button-text)';
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

  hoverColor(color: string, alpha = 0.8): string {
    if (this.bgBlack) {
      return 'rgba(0, 0, 0, 0.8)';
    }
    // Si es una variable CSS, la resolvemos en tiempo de ejecución
    if (color.startsWith('var(')) {
      const cssVar = color.match(/var\((--[^)]+)\)/)?.[1];
      if (cssVar) {
        const resolved = getComputedStyle(document.documentElement)
          .getPropertyValue(cssVar)
          .trim();
        return this.hexToRgba(resolved, alpha);
      }
    }

    // Si es un hex (#rrggbb o #rgb)
    return this.hexToRgba(color, alpha);
  }

  private hexToRgba(hex: string, alpha: number): string {
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
