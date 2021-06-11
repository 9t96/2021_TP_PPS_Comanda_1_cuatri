import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupervisorGuard } from '../guards/supervisor.guard';
import { HomeSupervisorComponent } from './pages/home-supervisor/home-supervisor.component';
import { RegistroEmpleadoComponent } from './pages/registro-empleado/registro-empleado.component';

const routes: Routes = [
  {path:"home", component:HomeSupervisorComponent, canActivate:[SupervisorGuard]},
  {path:"register", component:RegistroEmpleadoComponent, canActivate:[SupervisorGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorRoutingModule { }
