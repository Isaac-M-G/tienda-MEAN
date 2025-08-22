import { RouterModule, Routes } from '@angular/router';
import { PageProductsComponent } from './pages/page-products/page-products.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './service/auth.guard';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: PageProductsComponent },
  {
    path: 'products/edit/:id',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
  },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
