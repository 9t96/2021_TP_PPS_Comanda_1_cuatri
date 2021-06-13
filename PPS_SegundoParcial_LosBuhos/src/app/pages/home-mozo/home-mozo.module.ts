import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMozoPageRoutingModule } from './home-mozo-routing.module';

import { HomeMozoPage } from './home-mozo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMozoPageRoutingModule
  ],
  declarations: [HomeMozoPage]
})
export class HomeMozoPageModule {}
