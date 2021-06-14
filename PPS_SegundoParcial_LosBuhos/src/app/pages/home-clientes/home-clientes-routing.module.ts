import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeClientesPage } from './home-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: HomeClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeClientesPageRoutingModule {}
