import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { timeStamp } from 'console';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { eEstadoProducto } from 'src/app/enums/eEstadoProducto';
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
          if(mesa.estado == eEstadoMesa.OCUPADA){
            if (meCli.estado == eEstadoMesaCliente.ESPERANDO_PEDIDO) {
              let countReady = 0;
              meCli.productos.forEach((element,index) => {
                if(element.estado == eEstadoProducto.LISTO){
                  countReady+=1; 
                  if(meCli.productos.length == countReady){
                    meCli.listoParaServir = true;
                  }
                } 
              });
            }
          }
          mesa.mesaCliente = meCli
          return mesa;
        })
        this.mesas.sort( (a,b) => {return a.nro_mesa - b.nro_mesa})
        console.log(this.mesas);
      })
    })  
  }
  openDetailsWithQueryParams(param:any) {
    this.router.navigate(['detalle-pedido',{doc_id:param}] );
  }

}
