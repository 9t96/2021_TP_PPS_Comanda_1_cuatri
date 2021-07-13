import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeClientesPageRoutingModule } from './home-clientes-routing.module';

import { HomeClientesPage } from './home-clientes.page';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeClientesPageRoutingModule,
    NgxSpinnerModule
  ],
  declarations: [HomeClientesPage]
})
export class HomeClientesPageModule {}
