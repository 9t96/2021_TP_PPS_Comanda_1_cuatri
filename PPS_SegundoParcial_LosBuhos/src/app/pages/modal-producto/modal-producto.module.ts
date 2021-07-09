import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalProductoPageRoutingModule } from './modal-producto-routing.module';

import { ModalProductoPage } from './modal-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalProductoPageRoutingModule
  ],
  declarations: [ModalProductoPage]
})
export class ModalProductoPageModule {}
