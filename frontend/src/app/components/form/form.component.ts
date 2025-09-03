// src/app/components/form/form-field.model.ts
export interface FormField {
  name: string; // identificador del campo
  label: string; // texto de la etiqueta
  type: 'text' | 'number' | 'select' | 'file'; // tipo de input
  placeholder?: string;
  options?: { value: any; label: string }[]; // solo para select
  validators?: any[]; // validaciones (ej: Validators.required)
  errorMessages?: { [key: string]: string }; // mensajes personalizados por error
}

// src/app/components/form/form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../mini-components/button/button.component';
import { InputComponent } from '../../mini-components/input/input.component';
import { SelectComponent } from '../../mini-components/select/select.component';
import { FileInputComponent } from '../../mini-components/file-input/file-input.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    FileInputComponent,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  @Input() fields: FormField[] = [];
  @Input() initialValues: { [key: string]: any } = {};
  @Input() submitLabel = 'Submit';
  @Input() cancelLabel = 'Cancel';
  @Output() submitted = new EventEmitter<any>();
  @Input() padding: string = 'p-8';
  @Input() width: string = 'w-96';

  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {}

  @Output() formReady = new EventEmitter<FormGroup>();

  ngOnInit() {
    const group: any = {};
    this.fields.forEach((field) => {
      group[field.name] = [
        this.initialValues[field.name] ?? '',
        field.validators || [],
      ];
    });
    this.form = this.fb.group(group);
    this.formReady.emit(this.form);
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancelled.emit();
  }

  getErrorMessage(field: FormField): string {
    const control = this.form.get(field.name);
    if (!control || !control.errors) return '';

    // Mostramos error si:
    // 1. El campo está tocado y tiene error, aunque no se haya escrito nada
    // 2. El campo está sucio (dirty) y tiene error
    // 3. El formulario fue enviado
    if (control.touched || control.dirty || this.formSubmitted) {
      for (const errorName in control.errors) {
        // Si hay mensaje personalizado, lo usamos
        if (field.errorMessages && field.errorMessages[errorName]) {
          return field.errorMessages[errorName];
        }
      }
      // Mensaje por defecto
      return 'Este campo es inválido';
    }

    return '';
  }
}
