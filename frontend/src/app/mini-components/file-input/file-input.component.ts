import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
})
export class FileInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() accept?: string;
  @Input() errorMessage?: string;
  @Input() requiredMessage?: string;

  // Props de estilo iguales a InputComponent
  @Input() padding: string = 'px-3 py-2';
  @Input() borderColor: string = 'var(--border-color)';
  @Input() rounded: string = 'rounded-md';
  @Input() fontSize: string = '14px';
  @Input() textColor: string = 'var(--text-on-bg-layout)';
  @Input() bgColor: string = 'transparent';

  value?: File;
  touched = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: File | null): void {
    this.value = value ?? undefined;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.value = input.files[0];
      this.onChange(this.value);
    } else {
      this.value = undefined;
      this.onChange(null);
    }
    this.onTouched();
  }

  get showError(): boolean {
    return this.touched && !this.value;
  }
}
