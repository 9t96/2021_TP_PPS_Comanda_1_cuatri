import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltamesasPage } from './altamesas.page';

const routes: Routes = [
  {
    path: '',
    component: AltamesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltamesasPageRoutingModule {}
