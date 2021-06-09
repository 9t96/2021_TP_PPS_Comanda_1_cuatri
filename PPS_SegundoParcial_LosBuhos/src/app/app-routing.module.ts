import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProductosGuard } from './guards/productos/productos.guard';
import { SupervisorGuard } from './guards/supervisor.guard';
import { AltaProductoComponent } from './pages/alta-producto/alta-producto.component';
import { HomeSupervisorComponent } from './pages/home-supervisor/home-supervisor.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegistroEmpleadoComponent } from './pages/registro-empleado/registro-empleado.component';

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
    canActivate:[SupervisorGuard]
  },  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
