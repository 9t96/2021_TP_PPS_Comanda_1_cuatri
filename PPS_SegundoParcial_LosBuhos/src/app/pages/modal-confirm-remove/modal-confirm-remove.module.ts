import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalConfirmRemovePageRoutingModule } from './modal-confirm-remove-routing.module';

import { ModalConfirmRemovePage } from './modal-confirm-remove.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalConfirmRemovePageRoutingModule
  ],
  declarations: [ModalConfirmRemovePage]
})
export class ModalConfirmRemovePageModule {}
