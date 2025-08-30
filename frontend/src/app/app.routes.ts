import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageProductsComponent } from './pages/page-products/page-products.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './service/auth.guard';
import { GlobalVariables } from './shared/global-variables';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';

export const routes: Routes = [
  { path: GlobalVariables.appRoutes.home, component: PageProductsComponent },
  {
    path: `${GlobalVariables.appRoutes.products.editBase}/:id`,
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: GlobalVariables.appRoutes.products.create,
    component: CreateProductComponent,
  },
  {
    path: `${GlobalVariables.appRoutes.products.detailsBase}/:id`,
    component: SingleProductComponent,
  },

  //auth
  { path: GlobalVariables.appRoutes.register, component: RegisterComponent },
  { path: GlobalVariables.appRoutes.login, component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
