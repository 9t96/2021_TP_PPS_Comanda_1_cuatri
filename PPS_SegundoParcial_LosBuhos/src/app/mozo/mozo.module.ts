import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MozoRoutingModule } from './mozo-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatComponent } from './pages/chat/chat.component';


@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    MozoRoutingModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class MozoModule { }
