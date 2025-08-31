import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() padding: string = 'px-3 py-2';
  @Input() borderColor: string = 'var(--primary)';
  @Input() rounded: string = 'rounded-md';
  @Input() fontSize: string = '14px';
  @Input() textColor: string = 'var(--text)';
  @Input() bgColor: string = 'transparent';

  // 👇 Nuevo input para SVG
  @Input() customSvg?: string;
  @Input() iconSize?: string;
  @Input() iconColor?: string;

  value?: string;

  @Output() inputEvent = new EventEmitter<Event>();
  @Output() enterPressed = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  // Callbacks para ngModel
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value); // <-- Propaga a ngModel
    this.inputEvent.emit(event);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enterPressed.emit();
    }
  }
  // Getter del ícono sanitizado
  get icon(): SafeHtml | null {
    if (!this.customSvg) return null;

    const size = this.iconSize ?? '20px';
    const color = this.iconColor ?? this.textColor;

    const styledSvg = this.customSvg.replace(
      /<svg /,
      `<svg width="${size}" height="${size}" fill="${color}" `
    );

    return this.sanitizer.bypassSecurityTrustHtml(styledSvg);
  }
}
