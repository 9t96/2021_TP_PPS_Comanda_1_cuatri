import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesasPage } from './mesas.page';

const routes: Routes = [
  {
    path: '',
    component: MesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesasPageRoutingModule {}
