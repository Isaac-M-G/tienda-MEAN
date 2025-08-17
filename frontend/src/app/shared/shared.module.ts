import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardProductComponent } from '../components/card-product/card-product.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    CardProductComponent,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    CardProductComponent,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
