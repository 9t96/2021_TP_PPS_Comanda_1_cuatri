import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoGuard } from '../guards/empleado.guard';
import { MozoGuard } from '../guards/mozo.guard';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  {path:'chat', component:ChatComponent, canActivate:[EmpleadoGuard, MozoGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MozoRoutingModule { }
