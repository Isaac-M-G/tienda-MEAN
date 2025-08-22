import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CardProductComponent } from '../components/card-product/card-product.component';
import { ProductFormComponent } from '../components/product-form/product-form.component';
import { TopAlertComponent } from '../components/top-alert/top-alert.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CardProductComponent,
    ProductFormComponent,
    TopAlertComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CardProductComponent,
    ProductFormComponent,
    TopAlertComponent,
  ],
})
export class SharedModule {}
