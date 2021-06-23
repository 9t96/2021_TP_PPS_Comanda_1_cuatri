import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeProductoPageRoutingModule } from './home-producto-routing.module';

import { HomeProductoPage } from './home-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeProductoPageRoutingModule
  ],
  declarations: [HomeProductoPage]
})
export class HomeProductoPageModule {}
