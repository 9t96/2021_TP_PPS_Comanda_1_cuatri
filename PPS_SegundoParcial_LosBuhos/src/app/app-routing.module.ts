import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SupervisorGuard } from './guards/supervisor.guard';
import { HomeSupervisorComponent } from './supervisor/pages/home-supervisor/home-supervisor.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegistroEmpleadoComponent } from './supervisor/pages/registro-empleado/registro-empleado.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },{
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
  {path:'registro-cliente', component:RegisterComponent},
  // {path:'registro-personal', component:RegistroEmpleadoComponent, canActivate:[SupervisorGuard]},
  // {path:'home-supervisor', component:HomeSupervisorComponent, canActivate:[SupervisorGuard]},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'altamesas',
    loadChildren: () => import('./pages/altamesas/altamesas.module').then( m => m.AltamesasPageModule),
    canActivate:[SupervisorGuard]
  },
  {
    path: 'home-clientes',
    loadChildren: () => import('./pages/home-clientes/home-clientes.module').then( m => m.HomeClientesPageModule)
  },
  {
    path: 'home-mozo',
    loadChildren: () => import('./pages/home-mozo/home-mozo.module').then( m => m.HomeMozoPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
