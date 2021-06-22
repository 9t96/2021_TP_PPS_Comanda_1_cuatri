import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupervisorRoutingModule } from './supervisor-routing.module';
import { HomeSupervisorComponent } from './pages/home-supervisor/home-supervisor.component';
import { RegistroEmpleadoComponent } from './pages/registro-empleado/registro-empleado.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesComponent } from './pages/clientes/clientes.component';

@NgModule({
  declarations: [
    HomeSupervisorComponent,
    RegistroEmpleadoComponent,
    ClientesComponent
  ],
  imports: [
    CommonModule,
    SupervisorRoutingModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SupervisorModule { }