import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { timeStamp } from 'console';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { eEstadoProducto } from 'src/app/enums/eEstadoProducto';
import { eProducto } from 'src/app/enums/eProducto';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ModalPage } from '../modal/modal.page';
declare let window: any;
@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
})
export class CartaPage implements OnInit {

  public productos: Array<any>;
  public comanda: Array<any> = [];
  public mesasCliente: Array<any> = [];
  public currentMesaClient: any;
  public currentUser: any;
  public total: number = 0;
  public filtro: eProducto
  public mesaActual: any;
  public demoraEstimada: number = 0;
  public showSpinner: boolean = false;
  public showCarta:boolean = true;
  public showOK: boolean = false;
  public backbuttonHref: string;
  public saveProdIndex: any
  constructor(public prodSrv: ProductosService,public mesaSrv:MesasService, public pedidosSrv: PedidosService, public route: ActivatedRoute, public router: Router, public navCtrl: NavController,public modalController: ModalController, public toastSrv:ToastService, public pushSrv: NotificationsService) { }

  navigateBack(){
    this.navCtrl.back();
  }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    this.mesaActual = this.route.snapshot.paramMap.get('mesa')
    //Traigo productos
    this.prodSrv.TraerProductos().subscribe( data => {
      console.log(data)
      this.productos = data;
      this.productos.forEach( x => {
        x.cantidad = 0;
        x.selected = false;
        x.listoParaServir = false;
        x.estado = eEstadoProducto.PENDIENTE
      })
    });
    //Traigo mesa-cliente
    this.pedidosSrv.TraerMesaCliente().subscribe( mesas => {
      this.mesasCliente = mesas;
      this.currentMesaClient = this.mesasCliente.find( x => {
        return x.nro_mesa == this.mesaActual
      })
      console.log(this.currentMesaClient)
    })
  }

  async openModal(producto) {
    const modal = await this.modalController.create({
    component: ModalPage,
    cssClass: 'my-modal-class',
    componentProps: { producto: producto }
    });
    modal.onDidDismiss().then(data=>{
      console.log(data)
      this.productos[this.saveProdIndex] = data.data;
      this.CalcularDemora();
      this.CalcularTotal();
    })
    return await modal.present();
  }

  CalcularTotal(){
    this.total = 0;
    this.productos.forEach(x =>{
      this.total +=  x.selected ? x.precio * x.cantidad : 0
    })
  }
  

  AddProducto(index:number){
    this.productos[index].selected = true;
    this.productos[index].cantidad++;
    this.total += this.productos[index].precio;
    this.CalcularDemora();
  }
  RemoveProducto(nombre:string,index:number){
     if(this.productos[index].cantidad > 0){
       this.productos[index].cantidad--;
       if(this.productos[index].cantidad == 0){
        this.productos[index].selected = false;
       }
       this.total -= this.productos[index].precio;
       this.CalcularDemora();
     }
  }

  ScanQr() {
     window.cordova.plugins.barcodeScanner.scan(
         (result) => {
           this.AgregarConQr(result.text);
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
    //this.AgregarConQr("FPy6MuRtVpIPmLNXiX42");
  }

  CalcularDemora(){
    let prodSelected = 0;
    this.productos.forEach(x =>{
      prodSelected += (x.selected ? 1 : 0);
    })
    this.demoraEstimada = prodSelected > 0 ? Math.max.apply(Math, this.productos.map( x => { return (x.selected ? x.tiempo_elaboracion : null)})) : 0
  }

  AgregarConQr(textqr:string){
    console.log("entro")
    let obj = this.productos.findIndex( x => x.doc_id == textqr);
    if (obj !== -1) {
      console.log(obj)
      this.saveProdIndex = obj;
      console.log(this.saveProdIndex)
      this.openModal(this.productos[obj])
    } else {
      this.toastSrv.presentToast("No se encontro el producto buscado..", 2000,'warning');
    }
  }

  EnviarPedido(){
    let prodSelected = 0;
    this.productos.forEach(x =>{
      prodSelected += (x.selected ? 1 : 0);
    })
    if(prodSelected > 0){
      this.pedidosSrv.GenerarPedido(this.currentMesaClient.doc_id,this.productos.filter( x=> { return x.selected == true}))
      this.pedidosSrv.CambiarEstadoMesaCli(this.currentMesaClient.doc_id, eEstadoMesaCliente.CONFIRMANDO_PEDIDO);
      this.pushSrv.sendNotification("Nuevo pedido pendiente de aprobacion","La mesa nro " + this.currentMesaClient.nro_mesa + " hizo un pedido.",'mozo')
      this.ShowSpinner();
    }
    else{
      this.toastSrv.presentToast("Debe agregar productos antes de confirmar...", 2000,'warning');
    }
  }

  ShowSpinner(){
    this.showCarta = false;
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
      this.showOK = true;
      setTimeout(() => {
        this.navigateBack();
      }, 4000);
    }, 2000);
  }
  


}
