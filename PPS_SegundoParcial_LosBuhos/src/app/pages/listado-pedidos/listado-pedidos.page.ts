import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/clases/productos';
import { eEmpleado } from 'src/app/enums/eEmpleado';
import { eProducto } from 'src/app/enums/eProducto';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.page.html',
  styleUrls: ['./listado-pedidos.page.scss'],
})
export class ListadoPedidosPage implements OnInit {

  public pedidosCocina: Array<any> = [];
  public currentUser: any;
  public sectorProd: any;

  constructor(public pedidosSrv:PedidosService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.sectorProd = this.currentUser.tipo_empleado == eEmpleado.COCINERO ? eProducto.COCINA : eProducto.BEBIDA;
    this.pedidosSrv.TraerMesaCliente().subscribe( mesas => {
      this.pedidosCocina = [];
      mesas.forEach(element => {
        if(element.productos)
        element.productos.forEach(element => {
          if(element.sector == this.sectorProd)
          this.pedidosCocina.push(element);
        });
      });
      console.log(this.pedidosCocina)
    })
    
  }

}