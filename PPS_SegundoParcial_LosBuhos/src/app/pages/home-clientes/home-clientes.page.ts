import { templateVisitAll } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
  public showCartaBtn: boolean;
  constructor(public mesasSrv: MesasService,public prodSrv: ProductosService, public pedidosSrv:PedidosService, public authSrv: AuthService, public router: Router) {
    this.mesaSolicitada = new Mesa();
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    //Traigo mesaCliente
    this.pedidosSrv.TraerMesaCliente().subscribe( data =>{
      this.mesasCliente = data;
      console.log(data)
      this.isOnMesa = this.mesasCliente.some( x => {return x.user_uid == this.currentUser.uid})
      console.log("Esta sentado?" + this.isOnMesa)
      this.currentMesaCliente = this.mesasCliente.find( x =>  x.user_uid == this.currentUser.uid)
      console.log("Datos de mi mesa:" + JSON.stringify(this.currentMesaCliente));
    });
    //TRAIGO LISTA DE ESPERA PARA CHEKEAR QUE YA ESTE O NO EN ESPERA
    this.mesasSrv.TraerListaEspera().subscribe(data => {
      //Validar que no puede ponerse en espera una vez que se asigno a una mesa
      //CHEKEO QUE NO SE ENCUENTRE EN LISTA DE ESPERA
      this.isOnEspera = data.some( x => x.user_uid === this.currentUser.uid) ? true : false;
      this.qrBtnText = this.isOnEspera ? "Ponerse en lista de espera" : "Escanear Qr mesa"
      console.log("Esta en lista de espera?" + this.isOnEspera);
      // data.forEach(res => {
      //   if (res.user_uid == this.currentUser.uid) {
      //     this.isOnEspera = true;
      //     this.esperaID = res.doc_id_espera;
      //   }
      // });
    });

    //TRAIGO MESAS PARA VER SU ESTADO
    this.mesasSrv.TraerMesas().subscribe(data => {
      this.mesas = data;
    });
    console.log(this.currentUser);
  }

  logout(){
    this.authSrv.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

  ScanQr() {
    // window.cordova.plugins.barcodeScanner.scan(
    //    (result) => {
    //      this.resolveAction(result.text);
    //    },
    //    (err) => {
    //      console.log(err);
    //      //error al escanear
    //    },
    //    {
    //      showTorchButton: true,
    //      prompt: 'Scan your code',
    //      formats: 'QR_CODE',
    //      resultDisplayDuration: 2,
    //    }
    // );
    this.resolveAction("2");
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
        break;
    }
  }

  ResolveActionMesa(nro_mesa:number){
    if (this.isOnEspera) {
      //asignarmesa
    }
    else if(this.isOnMesa){
      this.ResolveActionInMesa();
    }

  }

  ResolveActionInMesa(){
    if (this.currentMesaCliente.estado == eEstadoMesaCliente.SENTADO) {
      this.showCartaBtn = true;
    }
    else if (this.currentMesaCliente.estado == eEstadoMesaCliente.CONFIRMANDO_PEDIDO) {
      console.log("ESPERANDO CONFIRMACION MOZO")
    }
    else if (this.currentMesaCliente.estado == eEstadoMesaCliente.ESPERANDO_PEDIDO) {
      console.log("ESPERANDO PEDIDO")
    }
    //Pagando
  }

  SolicitarMesa() {
    if (!this.isOnEspera) {
      this.mesasSrv.SolicitarMesa(this.currentUser);
    } else {
      console.log('YA SE ENCUENTRA EN LISTA DE ESPERA');
      //Error usted ya se encuentra en lista de espera.
    }
  }

  /**
   * Asigna la mesa al usuario si esta en lista de espera.
   * No se checkea mesaCliente porque no podria estar en espera si esta sentado..
   */

  asignarMesa(nro_mesa: number) {
    //NO FUNCIONA BIEN LA VARIABLE DE SI ESTA EN ESPERA EL USUARIO.

    if (this.isOnEspera) {
      //1 Verificar que la mesa este libre
      this.getMesa(nro_mesa);
      if (this.mesaSolicitada.estado == eEstadoMesa.LIBRE) {
        //2 verificar que la mesa no este en mesaCliente activa

          this.mesasSrv.AsignarMesaCliente(nro_mesa, this.docID_Mesa, this.currentUser.uid);

          this.mesasSrv.EliminarClienteListaEspera(this.esperaID);

          this.mesasSrv.ActualizarMesaEstado(this.docID_Mesa, eEstadoMesa.OCUPADA);

          alert("REDIRIGIR...");
      } else {
        alert("MESA OCUPADA MOSTRAR MENSAJE");
      }
    } else {
      alert("NO ESTA EN ESPERA"); //MOSTRAR ERROR
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
        alert(" NRO MESA =>  " + m.nro_mesa);

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


}
