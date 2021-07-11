import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ChatComponent } from './pages/chat/chat.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';
import { GameComponent } from './pages/game/game.component';


@NgModule({
  declarations: [
    ChatComponent,
    GameComponent,
    EncuestaComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class ClienteModule { }
