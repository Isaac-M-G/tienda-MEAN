import { Routes } from '@angular/router';
import { PageProductsComponent } from './pages/page-products/page-products.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';

export const routes: Routes = [
  { path: '', component: PageProductsComponent },
  { path: 'products/edit/:id', component: ProductEditComponent },
  { path: '**', redirectTo: '' },
];
