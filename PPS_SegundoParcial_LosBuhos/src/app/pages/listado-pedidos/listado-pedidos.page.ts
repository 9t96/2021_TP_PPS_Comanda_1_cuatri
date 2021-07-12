import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/clases/productos';
import { eEmpleado } from 'src/app/enums/eEmpleado';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { eEstadoProducto } from 'src/app/enums/eEstadoProducto';
import { eProducto } from 'src/app/enums/eProducto';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { ToastService } from 'src/app/services/toast/toast.service';

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

  constructor(public pedidosSrv:PedidosService, public prodSrv: ProductosService, public toastSrv: ToastService, public pushSrv: NotificationsService) { }

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
    let countReady = 0;
    this.mesas[item.mesaIndex].productos.forEach( (element,index) => {
      if(element.estado == eEstadoProducto.LISTO){
        countReady+=1; 
        if(this.mesas[item.mesaIndex].productos.length == countReady){
          this.pushSrv.sendNotification("Todo listo para servir","Los pedidos de la mesa " + this.mesas[item.mesaIndex].nro_mesa + " estan listos para servir",'mozo')
        }
      } 
    });
    this.prodSrv.CambiarEstadoProducto(item.parentDocId,this.mesas[item.mesaIndex].productos);
    this.toastSrv.presentToast("Se cambio el estado de pedido con exito!", 2000,'success');
  }

}
