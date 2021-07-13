import { templateVisitAll } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { NavigationStart, Router } from '@angular/router';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';
import { Usuario } from 'src/app/clases/usuario';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.service';
import { eToastType } from 'src/app/enums/eToastType';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare let window: any;


@Component({
  selector: 'app-home-clientes',
  templateUrl: './home-clientes.page.html',
  styleUrls: ['./home-clientes.page.scss'],
})
export class HomeClientesPage implements OnInit {

  public currentUser: any;
  public isOnEspera: boolean = false; //Indica si el usuario esta o no en lista de espera
  public isOnMesa: boolean = false; //Indica si el usuario esta o no actualmente relacionado con una mesa
  public mesas: any;
  public mesasCliente: Array<any>;
  public productos: Array<any>;
  public comanda: Array<any>;
  public showCarta = false;
  public mesaSolicitada: Mesa;
  public docID_Mesa: string;
  public esperaID: string;
  public mesaCliente: any;
  public currentMesaCliente: any;
  public qrBtnText: string;
  public showCartaBtn: boolean = false;
  public showChatBtn: boolean = false;
  public showDetalleBtn: boolean = false;
  public showGamesBtn: boolean = false;
  public showEncuestaBtn: boolean = false;
  public espera_docid : string;
  showStatsBtn: boolean;

  constructor(public mesasSrv: MesasService,
    public prodSrv: ProductosService, 
    public pedidosSrv:PedidosService, 
    public authSrv: AuthService, 
    public router: Router, 
    public toastSrv:ToastService,
    public pushSrv: NotificationsService,
    private spinner: NgxSpinnerService) {
    this.mesaSolicitada = new Mesa();
  }

  ionViewWillEnter(){
    //console.log("vava entrar")
    //this.showCartaBtn = false
    //this.showChatBtn = false
    //this.showDetalleBtn = false
    //this.showEncuestaBtn = false;
    //this.showGamesBtn = false;
    this.ngOnInit()
  }

  ngOnInit() {
    //console.log("lo corrio oninit")
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    //Traigo mesaCliente
    this.pedidosSrv.TraerMesaCliente().subscribe( data =>{
      this.mesasCliente = data;
      //console.log(data)
      this.isOnMesa = this.mesasCliente.some( x => {return x.user_uid == this.currentUser.uid})
      //console.log("Esta sentado?" + this.isOnMesa)
      this.currentMesaCliente = this.mesasCliente.find( x =>  x.user_uid == this.currentUser.uid)
      //console.log("Datos de mi mesa:" + JSON.stringify(this.currentMesaCliente));
      //this.ResolveActionInMesa();
    });
    //TRAIGO LISTA DE ESPERA PARA CHEKEAR QUE YA ESTE O NO EN ESPERA
    this.mesasSrv.TraerListaEspera().subscribe(data => {
      //Validar que no puede ponerse en espera una vez que se asigno a una mesa
      //CHEKEO QUE NO SE ENCUENTRE EN LISTA DE ESPERA
      this.isOnEspera = data.some( x => x.user_uid === this.currentUser.uid) ? true : false;
      if(this.isOnEspera) this.espera_docid = (data.find( x => x.user_uid === this.currentUser.uid)).doc_id;
      this.qrBtnText = this.SetQrBtnText();
    });

    //TRAIGO MESAS PARA VER SU ESTADO
    this.mesasSrv.TraerMesas().subscribe(data => {
      this.mesas = data;
    });
    console.log(this.currentUser);    
  }

  SetQrBtnText():string{
    let text;
    if (!this.isOnEspera && !this.isOnMesa) {
      text = "Ponerse en lista de espera";
    }
    else{
      text = "Escanear Qr mesa";
    }
    return text;
  }

  logout(){
    this.authSrv.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

  ScanQr() {
/*     window.cordova.plugins.barcodeScanner.scan(
      (result) => {
        this.spinner.show()
        this.resolveAction(result.text);
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
    ); */
    this.resolveAction("1");
  }

  AgregarProducto(index: any) {
    this.comanda.push(this.productos[index]);
    console.log(this.comanda);
  }

  resolveAction(text: string){
    console.log("Resolve action")
    const regex = /^[0-9]*$/;

    if (regex.test(text) == true) {
      var nro_Mesa = Number(text);
      text = "action-mesa"
    }

    switch (text) {
      case 'lista-espera':
        this.SolicitarMesa();
        break;
      case "action-mesa": //DESPUES DE ESTO MOSTRAR CARTA
        this.ResolveActionMesa(nro_Mesa);
        break;
      default:
          //Si el valor del qe es un numero se procede a asingar la mesa y se saca de la lista de espera al cliente
          //Validar que no puede ponerse en espera una vez que se asigno a una mesa
          this.toastSrv.presentToast("El codigo escaneado es invalido", 2500, "danger")
        break;
    }
  }

  ResolveActionMesa(nro_mesa:number){
    if (this.isOnEspera) {
      this.asignarMesa(nro_mesa);
    }
    else if(this.isOnMesa){
      if (this.currentMesaCliente.nro_mesa == nro_mesa) {
        this.ResolveActionInMesa();
      } else {
        this.spinner.hide();
        this.toastSrv.presentToast("Por favor, no escane codigos de otras mesas", 2500, "danger")
      }
    }
    else{
      this.spinner.hide();
      this.toastSrv.presentToast("Por favor, pongase en lista de espera", 2500, "danger")
    }

  }

  ResolveActionInMesa(){
    if (this.currentMesaCliente.estado == eEstadoMesaCliente.SENTADO) {
      this.showCartaBtn = true;
      this.showChatBtn = true;
      this.spinner.hide();
    }
    else if (this.currentMesaCliente.estado == eEstadoMesaCliente.CONFIRMANDO_PEDIDO) {
      this.showChatBtn = true;
      this.showDetalleBtn = true;
      this.spinner.hide();
    }
    else if (this.currentMesaCliente.estado == eEstadoMesaCliente.ESPERANDO_PEDIDO) {
      this.showChatBtn = true;
      this.showDetalleBtn = true;
      this.showGamesBtn = true;
      this.showEncuestaBtn = true;
      this.showStatsBtn = true;
      this.spinner.hide();
    }
    else if(this.currentMesaCliente.estado == eEstadoMesaCliente.PEDIDO_ENTREGADO) {
      this.showChatBtn = true;
      this.showDetalleBtn = true;
      this.showGamesBtn = true;
      this.showEncuestaBtn = true;
      this.showStatsBtn = true;
      this.spinner.hide();
    }
    else if(this.currentMesaCliente.estado == eEstadoMesaCliente.COMIENDO) {
      this.showChatBtn = true;
      this.showDetalleBtn = true;
      this.showGamesBtn = true;
      this.showEncuestaBtn = true;
      this.showStatsBtn = true;
      this.spinner.hide();
    }
    else if(this.currentMesaCliente.estado == eEstadoMesaCliente.PAGANDO) {
      this.showDetalleBtn = true;
      this.showEncuestaBtn = true;
      this.showChatBtn = true;
      this.showStatsBtn = true;
      this.spinner.hide();
    }
    

  }

  SolicitarMesa() {
    this.spinner.hide();
    if (!this.isOnEspera) {
      this.mesasSrv.SolicitarMesa(this.currentUser);
      this.toastSrv.presentToast("Se ingreso a lista de espera con exito", 2500, "success");
      this.pushSrv.sendNotification("Hay nuevos clientes en lista de espera",this.currentUser.nombre + " ingreso a la lista de espera.",'mozo')
      this.showStatsBtn = true;
    } else {
      this.toastSrv.presentToast("Usted ya se encuentra en lista de espera", 2000,'warning');
    }
  }

  /**
   * Asigna la mesa al usuario si esta en lista de espera.
   * No se checkea mesaCliente porque no podria estar en espera si esta sentado..
   */

  asignarMesa(nro_mesa: number) {
    if (this.isOnEspera) {
      this.getMesa(nro_mesa);
      if (this.mesaSolicitada.estado == eEstadoMesa.LIBRE) {
          this.mesasSrv.ActualizarMesaEstado(this.docID_Mesa, eEstadoMesa.OCUPADA);
          this.mesasSrv.AsignarMesaCliente(nro_mesa, this.docID_Mesa, this.currentUser.uid);
          this.mesasSrv.EliminarClienteListaEspera(this.espera_docid);
          this.showCartaBtn = true;
          this.showChatBtn = true;
          this.spinner.hide();
          this.toastSrv.presentToast("Ingresaste a la mesa " + nro_mesa, 2000,'success');
      } else {
        this.spinner.hide();
        this.toastSrv.presentToast("La mesa escaneada se encuentra OCUPADA", 2000,'warning');
      }
    } else {
      this.spinner.hide();
      this.toastSrv.presentToast("No se encuentra en lista de espera...", 2000,'warning');
    }
  }

  /**
   * Retorna una mesa especifica como un objeta MESA
   * y tambien retorna el id del documento en Firebase.
  */
  getMesa(nro_mesa: number) {

    this.mesas.forEach(m => {
      if (m.nro_mesa == nro_mesa) {

        this.mesaSolicitada.comensales = m.comensales;
        this.mesaSolicitada.estado = m.estado;
        this.mesaSolicitada.nro_mesa = m.nro_mesa;
        this.mesaSolicitada.tipo_mesa = m.tipo_mesa;
        this.docID_Mesa = m.doc_id_mesa;
      }
    });
  }
  /*Retorna true si la mesa no esta en la coleccion mesaCliente
    Retorna false si la mesa se encuentra en la 
      coleccion mesaCliente con el esta ACTIVA(no esta liberada).
  */
  MesaHasCliente(nro_mesa): boolean {
    var retorno = true;

    this.mesaCliente.forEach(mc => {
      if (mc.nro_mesa == nro_mesa) {
        if (mc.estadoMesaCliente == eEstadoMesaCliente.SENTADO) {
          retorno = false;
        }
      }

    });
    return retorno;
  }

  navigateCarta(){
    this.router.navigate(['carta', {mesa: this.currentMesaCliente.nro_mesa}])
  }

  navigateDetalle(){
    this.router.navigate(['detalle-pedido', {doc_id: this.currentMesaCliente.doc_id}])
  }

  goToChat(){
    this.router.navigate(['cliente/chat']);
  }
  goToGame(){
    if (!this.currentMesaCliente.ganoJuego) {
      this.router.navigate(['cliente/game']);
    }
    else{
      this.toastSrv.presentToast("Usted ya participo del juego..", 2500, "warning")
    }
  }

  goToEncuesta(){
    if(this.currentMesaCliente.hasEncuesta){
      this.toastSrv.presentToast("Usted ya ha completado la encuesta", 2000,'warning');
    }else{
      this.router.navigate(['cliente/encuesta', {mesaClienteId: this.currentMesaCliente.doc_id}]);
    }
  }

  goToEstadisticas(){
    this.router.navigate(['cliente/estadisticas']);
  }
}
