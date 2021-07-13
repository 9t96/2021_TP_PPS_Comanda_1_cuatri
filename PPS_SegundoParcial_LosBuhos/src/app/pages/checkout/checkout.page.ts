import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
declare let window: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  satisfaccion: string;
  showJuego: boolean = false;
  


  ngOnInit() {
  }

  pedido:any
  showPropina: boolean = false
  valorPropina: number;
  valorDescuento: number;
  constructor(navParams: NavParams,public viewCtrl: ModalController, public mesasSrv: PedidosService, public pushSrv: NotificationsService, public router: Router) {
    this.pedido=navParams.get('pedido')
    if (this.pedido.ganoJuego) {
      this.valorDescuento =  this.pedido.total * 0.10
      this.pedido.total = this.pedido.total - this.valorDescuento
      this.showJuego = true;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.pedido);
  }

  AgregarPropina(){
    window.cordova.plugins.barcodeScanner.scan(
        (result) => {
          this.ResolvePropina(result.text);
        },
        (err) => {
          console.log(err);
          //error al escanear
        },
        {
          showTorchButton: true,
          prompt: 'Scan your code',
          formats: 'QR_CODE',
        resultDisplayDuration: 2,
        }
    );
    //this.ResolvePropina("muy bien");
  }

  ResolvePropina(textQr:string){
    switch(textQr) {
      case "excelente":
        this.AplicarPropina(textQr,0.20)
        break;
      case "muy bien":
        this.AplicarPropina(textQr,0.15)
        break;
      case "bien":
        this.AplicarPropina(textQr,0.10)
        break;
      case "regular":
        this.AplicarPropina(textQr,0.5)
        break;
      case "malo":
        this.AplicarPropina(textQr,0)
        break;
    }
  }

  AplicarPropina(satisfaccion:string,propina:number){
    if(propina !== 0){
      let totalPropina = Math.round(this.pedido.total * propina);
      this.pedido.total += totalPropina;
      this.satisfaccion = satisfaccion
      this.valorPropina = totalPropina;
      this.showPropina = true;
    }
  }

  NotificarMozo(){
    this.mesasSrv.CambiarEstadoMesaCli(this.pedido.doc_id,eEstadoMesaCliente.PAGANDO)
    this.pushSrv.sendNotification("Un cliente esta solicitando la cuenta","La mesa " + this.pedido.nro_mesa + " esta solicitando la cuenta",'mozo')
    this.viewCtrl.dismiss("ok");
    this.router.navigate(['home-clientes']);
  }


}
