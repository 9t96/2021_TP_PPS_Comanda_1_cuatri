import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoPedidosPage } from './listado-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoPedidosPageRoutingModule {}
