import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltamesasPageRoutingModule } from './altamesas-routing.module';

import { AltamesasPage } from './altamesas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltamesasPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AltamesasPage]
})
export class AltamesasPageModule {}
