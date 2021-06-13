import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMozoPage } from './home-mozo.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMozoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMozoPageRoutingModule {}
