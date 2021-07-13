import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProductosGuard } from './guards/productos/productos.guard';
import { SupervisorGuard } from './guards/supervisor.guard';
import { HomeSupervisorComponent } from './supervisor/pages/home-supervisor/home-supervisor.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegistroEmpleadoComponent } from './supervisor/pages/registro-empleado/registro-empleado.component';
import { AltaProductoComponent } from './pages/alta-producto/alta-producto.component';


import { ProductoBajaComponent } from './pages/producto-baja/producto-baja.component';
import { ProductoModificacionComponent } from './pages/producto-modificacion/producto-modificacion.component';
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
    path: 'mozo',
    loadChildren: () => import('./mozo/mozo.module').then( m => m.MozoModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente.module').then( m => m.ClienteModule)
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
  },
  {
    path: 'mesas',
    loadChildren: () => import('./pages/mesas/mesas.module').then( m => m.MesasPageModule)
  },
  {
    path: 'detalle-pedido',
    loadChildren: () => import('./pages/detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule)
  },
  {
    path: 'producto-alta',
    component:AltaProductoComponent,
    //canActivate:[ProductosGuard]
    canActivate:[ProductosGuard]
  },
  {
    path: 'producto-modificar',
    component:ProductoModificacionComponent,
    //canActivate:[ProductosGuard]
    canActivate:[ProductosGuard]
  },
  {
    path: 'producto-eliminar',
    component:ProductoBajaComponent,
    //canActivate:[ProductosGuard]
    canActivate:[ProductosGuard] },
  { 
    path: 'modal',
    loadChildren: () => import('./pages/modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./pages/estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
  },
  {
    path: 'encuesta-empleado',
    loadChildren: () => import('./pages/encuesta-empleado/encuesta-empleado.module').then( m => m.EncuestaEmpleadoPageModule)
  },
  {
    path: 'modal-producto',
    loadChildren: () => import('./pages/modal-producto/modal-producto.module').then( m => m.ModalProductoPageModule)
  },
  {
    path: 'modal-confirm-remove',
    loadChildren: () => import('./pages/modal-confirm-remove/modal-confirm-remove.module').then( m => m.ModalConfirmRemovePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
