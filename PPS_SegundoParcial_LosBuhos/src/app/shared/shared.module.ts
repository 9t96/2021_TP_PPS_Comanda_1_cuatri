import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioModificacionComponent } from './usuario-modificacion/usuario-modificacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UsuarioModificacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    UsuarioModificacionComponent
  ]
})
export class SharedModule { }
