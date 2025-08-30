import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-filter-search',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.css'],
})
export class FilterSearchComponent<T = any> {
  @Input() items: T[] = [];
  @Input() fields: (keyof T)[] = [];
  @Input() type: 'text' | 'number' | 'select' = 'text';
  @Input() options: string[] = []; // opciones para el select múltiple
  @Output() filtered = new EventEmitter<T[]>();

  // text
  searchTerm: string = '';

  // number
  minValue: number | null = null;
  maxValue: number | null = null;

  // select
  selectedOptions: string[] = [];

  onSearchChange() {
    let results = this.items;

    // filtro de texto
    if (this.type === 'text') {
      const term = this.searchTerm.toLowerCase();
      results = results.filter((item) =>
        this.fields.some((field) => {
          const value = item[field];
          return (
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(term)
          );
        })
      );
    }

    // filtro por rango numérico
    if (this.type === 'number') {
      results = results.filter((item) =>
        this.fields.some((field) => {
          const value = item[field];
          if (typeof value !== 'number') return false;
          const validMin = this.minValue == null || value >= this.minValue;
          const validMax = this.maxValue == null || value <= this.maxValue;
          return validMin && validMax;
        })
      );
    }

    // filtro select múltiple
    if (this.type === 'select' && this.selectedOptions.length > 0) {
      results = results.filter((item) =>
        this.fields.some((field) => {
          const value = item[field];
          return (
            value !== null &&
            value !== undefined &&
            this.selectedOptions.includes(value.toString())
          );
        })
      );
    }

    this.filtered.emit(results);
  }

  toggleOption(option: string) {
    if (this.selectedOptions.includes(option)) {
      this.selectedOptions = this.selectedOptions.filter((o) => o !== option);
    } else {
      this.selectedOptions.push(option);
    }
    this.onSearchChange();
  }
}
