import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioModificacionComponent } from './usuario-modificacion/usuario-modificacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    UsuarioModificacionComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    UsuarioModificacionComponent
  ]
})
export class SharedModule { }
