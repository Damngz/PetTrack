import { Routes } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { MascotaDetalleComponent } from "./mascota-detalle/mascota-detalle.component";

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
  },
  {
    path: 'mascotas',
    loadComponent: () => import('./mascotas/mascotas.component').then(load => load.MascotasComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'mascotas/:id',
    loadComponent: () => import('./mascota-detalle/mascota-detalle.component').then(load => load.MascotaDetalleComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tutores',
    loadComponent: () => import('./tutores/tutores.component').then(load => load.TutoresComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'citas',
    loadComponent: () => import('./citas/citas.component').then(load => load.CitasComponent),
    canActivate: [AuthGuard]
  }
]
