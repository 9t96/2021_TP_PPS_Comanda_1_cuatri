import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {
  public paramDocId: any;
  public pedido: any;
  public isLoaded: boolean = false;
  public currentUser: any;
  public isMozo: boolean;
  constructor(private route: ActivatedRoute, private router: Router, public pedidosSrv: PedidosService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.isMozo = this.currentUser.rol == "EMPLEADO" ? true : false;
    this.pedidosSrv.TraerPedido(this.route.snapshot.paramMap.get('doc_id')).subscribe( pedido => {
      this.pedido = pedido;
      if (this.pedido.productos) {
        this.pedido.demora_estimada = Math.max.apply(Math, this.pedido.productos.map( x => {return x.tiempo_elaboracion}))
        this.pedido.total = 0;
        this.pedido.productos.forEach(element => {
          this.pedido.total += element.precio * element.cantidad;
        });
      }
      this.isLoaded = true;
      console.log(this.pedido)
    })

  }

  navigateCarta(){
    this.router.navigate(['carta',{mesa: this.pedido.nro_mesa}])
  }

  AprobarPedido(){
    this.pedidosSrv.CambiarEstadoMesaCli(this.pedido.doc_id,eEstadoMesaCliente.ESPERANDO_PEDIDO)
  }

}
