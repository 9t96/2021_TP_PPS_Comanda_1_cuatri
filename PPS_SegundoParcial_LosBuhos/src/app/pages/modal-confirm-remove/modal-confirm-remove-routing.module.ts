import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalConfirmRemovePage } from './modal-confirm-remove.page';

const routes: Routes = [
  {
    path: '',
    component: ModalConfirmRemovePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalConfirmRemovePageRoutingModule {}
