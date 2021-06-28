import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCocineroPageRoutingModule } from './home-cocinero-routing.module';

import { HomeCocineroPage } from './home-cocinero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCocineroPageRoutingModule
  ],
  declarations: [HomeCocineroPage]
})
export class HomeCocineroPageModule {}
