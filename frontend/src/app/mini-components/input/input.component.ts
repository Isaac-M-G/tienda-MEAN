import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() value?: string;
  @Input() padding: string = 'px-3 py-2';
  @Input() borderColor: string = '#d1d5db'; // gris Tailwind por defecto
  @Input() rounded: string = 'rounded-md';
  @Input() fontSize: string = '14px';
  @Input() textColor: string = '#111827'; // color texto gris oscuro

  @Output() valueChange = new EventEmitter<string>();
  @Output() inputEvent = new EventEmitter<Event>();
  @Output() enterPressed = new EventEmitter<void>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
    this.inputEvent.emit(event);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enterPressed.emit();
    }
  }
}
