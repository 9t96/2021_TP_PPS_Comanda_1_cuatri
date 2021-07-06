import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/clases/productos';
import { eEmpleado } from 'src/app/enums/eEmpleado';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { eEstadoProducto } from 'src/app/enums/eEstadoProducto';
import { eProducto } from 'src/app/enums/eProducto';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ProductosService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.page.html',
  styleUrls: ['./listado-pedidos.page.scss'],
})
export class ListadoPedidosPage implements OnInit {

  public pedidosCocina: Array<any> = [];
  public mesas: Array<any> = [];
  public currentUser: any;
  public sectorProd: any;

  constructor(public pedidosSrv:PedidosService, public prodSrv: ProductosService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.sectorProd = this.currentUser.tipo_empleado == eEmpleado.COCINERO ? eProducto.COCINA : eProducto.BEBIDA;
    this.pedidosSrv.TraerMesaCliente().subscribe( mesas => {
      this.mesas = mesas;
      this.pedidosCocina = [];
      this.mesas.forEach( (mesa,index) => {
        if(mesa.productos){
          mesa.productos.forEach( (prod,prodIndex)=> {
            if(prod.sector == this.sectorProd && mesa.estado == "ESPERANDO_PEDIDO"){
            prod.parentDocId = mesa.doc_id
            prod.mesaIndex = index;
            prod.prodIndex = prodIndex;
            this.pedidosCocina.push(prod);
            }
          });
        }
      });
      console.log(this.pedidosCocina)
    })

    
  }

  CambiarEstadoProducto(item: any, nuevoEstado: string){

    //Send push if all products are ready
    let nuevoestado = nuevoEstado;
    this.mesas[item.mesaIndex].productos[item.prodIndex].estado = nuevoestado;
    this.prodSrv.CambiarEstadoProducto(item.parentDocId,this.mesas[item.mesaIndex].productos);
  }

}
