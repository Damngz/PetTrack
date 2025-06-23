import { Routes } from "@angular/router";
import { AuthGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component').then(load => load.LoginComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(load => load.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(load => load.HomeComponent),
    canActivate: [AuthGuard]
  }
]
