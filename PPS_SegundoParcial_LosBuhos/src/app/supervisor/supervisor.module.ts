import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupervisorRoutingModule } from './supervisor-routing.module';
import { HomeSupervisorComponent } from './pages/home-supervisor/home-supervisor.component';
import { RegistroEmpleadoComponent } from './pages/registro-empleado/registro-empleado.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { UsuarioUpdateComponent } from './pages/usuario-update/usuario-update.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeSupervisorComponent,
    RegistroEmpleadoComponent,
    ClientesComponent,
    UsuarioUpdateComponent
  ],
  imports: [
    CommonModule,
    SupervisorRoutingModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class SupervisorModule { }
