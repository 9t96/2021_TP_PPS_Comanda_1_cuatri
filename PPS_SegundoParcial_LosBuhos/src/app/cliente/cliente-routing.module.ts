import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteGuard } from '../guards/cliente.guard';
import { ChatComponent } from './pages/chat/chat.component';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { GameComponent } from './pages/game/game.component';

const routes: Routes = [
  {path:'chat', component:ChatComponent, canActivate:[ClienteGuard]},
  {path:'encuesta', component:EncuestaComponent, canActivate:[ClienteGuard]},
  {path:'estadisticas', component:EstadisticasComponent, canActivate:[ClienteGuard]},
  {path:'game', component:GameComponent, canActivate:[ClienteGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
