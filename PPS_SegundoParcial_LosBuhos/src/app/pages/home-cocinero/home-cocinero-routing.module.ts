import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCocineroPage } from './home-cocinero.page';

const routes: Routes = [
  {
    path: '',
    component: HomeCocineroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeCocineroPageRoutingModule {}
