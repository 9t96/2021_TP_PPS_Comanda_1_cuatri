import { Component, OnInit } from '@angular/core';
import { MesasService } from 'src/app/services/mesas/mesas.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
})
export class ListaEsperaPage implements OnInit {

  public listaEspera: any;

  constructor(public mesasSrv: MesasService) { }

  ngOnInit() {
    this.mesasSrv.TraerListaEspera().subscribe(data =>{
      this.listaEspera = data;
    })
  }

}
