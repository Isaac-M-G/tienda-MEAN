import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.css'],
})
export class FilterSearchComponent<T = any> {
  @Input() items: T[] = [];
  @Input() fields: (keyof T)[] = [];
  @Output() filtered = new EventEmitter<T[]>();

  searchTerm: string = '';

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    const results = this.items.filter((item) =>
      this.fields.some((field) => {
        const value = item[field];
        return value !== null && value !== undefined && value.toString().toLowerCase().includes(term);
      })
    );
    this.filtered.emit(results);
  }
}
