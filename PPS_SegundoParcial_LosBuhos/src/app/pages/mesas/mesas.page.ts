import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { timeStamp } from 'console';
import { MesasService } from 'src/app/services/mesas/mesas.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {

  public mesas: Array<any>
  public mesasCliente: Array<any>

  constructor(public mesasSrv: MesasService, public router: Router) { }

  ngOnInit() {
    this.mesasSrv.TraerMesas().subscribe( mesas => {
      this.mesas = mesas;
      this.mesasSrv.TraerMesaCliente().subscribe( mesasCli => {
        this.mesasCliente = mesasCli;
        this.mesas.map( mesa => {
          let meCli = this.mesasCliente.find( x => {return x.nro_mesa == mesa.nro_mesa});
          mesa.mesaCliente = meCli;
          return mesa;
        })
        this.mesas.sort( (a,b) => {return a.nro_mesa - b.nro_mesa})
        console.log(this.mesas);
      })
    })  
  }
  openDetailsWithQueryParams(param:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(param)
      }
    };
    this.router.navigate(['detalle-pedido',{special:param}] );
  }

}
