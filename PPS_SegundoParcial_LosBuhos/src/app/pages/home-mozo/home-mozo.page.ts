import { Component, OnInit } from '@angular/core';
import { MesasService } from 'src/app/services/mesas/mesas.service';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
})
export class HomeMozoPage implements OnInit {

  public listaEspera: any;

  constructor(public mesasSrv: MesasService) { }

  ngOnInit() {
    this.mesasSrv.TraerListaEspera().subscribe(data =>{
      this.listaEspera = data;
    })
  }

}
