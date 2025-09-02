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
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() options: { value: any; label: string; icon?: string }[] = [];
  @Input() placeholder: string = 'Seleccionar';
  @Input() bgColor: string = 'transparent';
  @Input() textColor: string = 'var(--text-on-bg-layout)';
  @Input() borderColor: string = 'var(--border-color)';
  @Input() padding: string = 'px-3 py-2';
  @Input() rounded: string = 'rounded-md';
  @Input() customSvg?: string;
  @Input() iconSize?: string;
  @Input() iconColor?: string;
  @Input() hoverBgColor?: string;
  @Input() hoverTextColor?: string;

  @Output() changeEvent = new EventEmitter<any>();

  value?: any;
  hover = false;

  constructor(private sanitizer: DomSanitizer) {}

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

  selectOption(option: any) {
    this.value = option.value;
    this.onChange(this.value);
    this.changeEvent.emit(this.value);
  }

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

  get selectedLabel(): string {
    const selected = this.options.find((o) => o.value === this.value);
    return selected ? selected.label : this.placeholder || '';
  }
}
