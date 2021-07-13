import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalProductoPage } from './modal-producto.page';

const routes: Routes = [
  {
    path: '',
    component: ModalProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalProductoPageRoutingModule {}
