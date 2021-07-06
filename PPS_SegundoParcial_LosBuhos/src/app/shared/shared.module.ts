import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioModificacionComponent } from './usuario-modificacion/usuario-modificacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SalaChatComponent } from './sala-chat/sala-chat.component';
import { UsuarioItemComponent } from './usuario-item/usuario-item.component';



@NgModule({
  declarations: [
    UsuarioModificacionComponent,
    SalaChatComponent,  
    UsuarioItemComponent  
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    UsuarioModificacionComponent,
    SalaChatComponent,    
    UsuarioItemComponent
  ]
})
export class SharedModule { }
