import { Routes } from '@angular/router';
import { redirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    canActivate: [redirectGuard],
    loadComponent: () =>
      import('./pages/empty/empty.page').then((m) => m.EmptyPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'email-validation',
    loadComponent: () =>
      import('./pages/email-validation/email-validation.page').then(
        (m) => m.EmailValidationPage
      ),
  },
  {
    path: 'create-products',
    loadComponent: () =>
      import('./pages/create-products/create-products.page').then(
        (m) => m.CreateProductsPage
      ),
  },
  {
    path: 'edit-available-products',
    loadComponent: () =>
      import(
        './pages/edit-available-products/edit-available-products.page'
      ).then((m) => m.EditAvailableProductsPage),
  },
  {
    path: 'selected-products',
    loadComponent: () =>
      import('./pages/selected-products/selected-products.page').then(
        (m) => m.SelectedProductsPage
      ),
  },
  {
    path: 'your-products',
    loadComponent: () => import('./your-products/your-products.page').then( m => m.YourProductsPage)
  },
  {
    path: 'edit-product',
    loadComponent: () => import('./pages/edit-product/edit-product.page').then( m => m.EditProductPage)
  },
  {
    path: 'sell',
    loadComponent: () => import('./pages/sell/sell.page').then( m => m.SellPage)
  },
];
