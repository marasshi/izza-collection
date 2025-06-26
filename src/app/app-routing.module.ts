import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductManagementComponent } from './pages/admin/product-management/product-management.component';
import { OrderManagementComponent } from './pages/admin/order-management/order-management.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { OrderDetailComponent } from './pages/admin/order-detail/order-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'order', loadComponent: () => import('./pages/order-form/order-form.component').then(m => m.OrderFormComponent) },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: 'products', component: ProductManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'orders/:id', component: OrderDetailComponent }
    ]
  },
  { path: '**', redirectTo: '' } // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
