import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  satisfaccion: string;
  


  ngOnInit() {
  }

  pedido:any
  showPropina: boolean = false
  valorPropina: number;
  constructor(navParams: NavParams,public viewCtrl: ModalController, public mesasSrv: PedidosService) {

    this.pedido=navParams.get('pedido')

  }

  dismiss() {
    this.viewCtrl.dismiss(this.pedido);
  }

  AgregarPropina(){
      // window.cordova.plugins.barcodeScanner.scan(
      //     (result) => {
      //       this.AgregarConQr(result.text);
      //     },
      //     (err) => {
      //       console.log(err);
      //       //error al escanear
      //     },
      //     {
      //       showTorchButton: true,
      //       prompt: 'Scan your code',
      //       formats: 'QR_CODE',
      //      resultDisplayDuration: 2,
      //     }
      //  );
      this.ResolvePropina("muy bien");
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
    this.viewCtrl.dismiss("ok");
  }


}
