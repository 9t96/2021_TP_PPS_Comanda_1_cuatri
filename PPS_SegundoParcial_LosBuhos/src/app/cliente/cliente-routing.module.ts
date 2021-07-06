import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteGuard } from '../guards/cliente.guard';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  {path:'chat', component:ChatComponent, canActivate:[ClienteGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
