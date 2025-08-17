import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CardProductComponent } from '../components/card-product/card-product.component';
// import { ProductFormComponent } from '../components/product-form/product-form.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // CardProductComponent,
    // ProductFormComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // CardProductComponent,
    // ProductFormComponent,
  ],
})
export class SharedModule {}
