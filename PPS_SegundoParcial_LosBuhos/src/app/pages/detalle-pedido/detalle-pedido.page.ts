import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
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
  constructor(private route: ActivatedRoute, private router: Router, public pedidosSrv: PedidosService) {
  }

  ngOnInit() {
    this.pedidosSrv.TraerPedido(this.route.snapshot.paramMap.get('special')).subscribe( pedido => {
      this.pedido = pedido;
      this.isLoaded = true;
      console.log(this.pedido)
    })

  }

  navigateCarta(){
    this.router.navigate(['carta',{mesa: this.pedido.nro_mesa}])
  }

  AprobarPedido(){
    
  }

}
