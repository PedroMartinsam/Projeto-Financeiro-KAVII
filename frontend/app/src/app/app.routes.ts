// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },

  { path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },

  { path: 'lancamentos',
    canActivate: [authGuard],
    loadComponent: () => import('./lancamentos/lancamentos.component').then(m => m.LancamentosComponent) },

  { path: 'contas',
    canActivate: [authGuard],
    loadComponent: () => import('./contas/contas.component').then(m => m.ContasComponent) },

  { path: 'terceiros',
    canActivate: [authGuard],
    loadComponent: () => import('./terceiros/terceiros.component').then(m => m.TerceirosComponent) },

  { path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent) },

  { path: 'centroCustos',
    canActivate: [authGuard],
    loadComponent: () => import('./centroCustos/centroCustos.component').then(m => m.CentroCustosComponent) },

  { path: 'bancos',
    canActivate: [authGuard],
    loadComponent: () => import('./bancos/bancos.component').then(m => m.BancosComponent) },

  { path: 'metaFinanceiras',
    canActivate: [authGuard],
    loadComponent: () => import('./metaFinanceiras/metaFinanceiras.component').then(m => m.MetaFinanceirasComponent) },

      { path: 'extrato', loadComponent: () =>
    import('./extrato/extrato-lancamentos.component')
      .then(m => m.ExtratoLancamentosComponent) },

  { path: '**', redirectTo: 'home' }

];
