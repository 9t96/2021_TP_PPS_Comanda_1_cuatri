import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProductosGuard } from './guards/productos/productos.guard';
import { SupervisorGuard } from './guards/supervisor.guard';
import { HomeSupervisorComponent } from './supervisor/pages/home-supervisor/home-supervisor.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegistroEmpleadoComponent } from './supervisor/pages/registro-empleado/registro-empleado.component';
import { AltaProductoComponent } from './pages/alta-producto/alta-producto.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./supervisor/supervisor.module').then( m => m.SupervisorModule)
  },
  {
    path:'registro-cliente', component:RegisterComponent
  },
  // {path:'registro-personal', component:RegistroEmpleadoComponent, canActivate:[SupervisorGuard]},
  // {path:'home-supervisor', component:HomeSupervisorComponent, canActivate:[SupervisorGuard]},
  {
    path:'registro-cliente',
    component:RegisterComponent
  },
  {
    path:'registro-personal',
    component:RegistroEmpleadoComponent,
    canActivate:[SupervisorGuard]
  },
  {
    path:'home-supervisor',
    component:HomeSupervisorComponent,
    canActivate:[SupervisorGuard]
  },
  {
    path: 'altamesas',
    loadChildren: () => import('./pages/altamesas/altamesas.module').then( m => m.AltamesasPageModule),
    canActivate:[SupervisorGuard]
  },
  {
    path: 'producto',
    component:AltaProductoComponent,
    //canActivate:[ProductosGuard]
    canActivate:[ProductosGuard]
  },
  {
    path: 'home-clientes',
    loadChildren: () => import('./pages/home-clientes/home-clientes.module').then( m => m.HomeClientesPageModule)
  },
  {
    path: 'home-mozo',
    loadChildren: () => import('./pages/home-mozo/home-mozo.module').then( m => m.HomeMozoPageModule)
  },
  {
    path: 'home-cocinero',
    loadChildren: () => import('./pages/home-cocinero/home-cocinero.module').then( m => m.HomeCocineroPageModule)
  },
  {
    path: 'carta',
    loadChildren: () => import('./pages/carta/carta.module').then( m => m.CartaPageModule)
  },
  {
    path: 'lista-espera',
    loadChildren: () => import('./pages/lista-espera/lista-espera.module').then( m => m.ListaEsperaPageModule)
  },
  {
    path: 'listado-pedidos',
    loadChildren: () => import('./pages/listado-pedidos/listado-pedidos.module').then( m => m.ListadoPedidosPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
