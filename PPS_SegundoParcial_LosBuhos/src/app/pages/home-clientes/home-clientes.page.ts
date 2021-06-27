import { templateVisitAll } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';
import { Usuario } from 'src/app/clases/usuario';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
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
  public isOnEspera: boolean;
  public mesas: any;
  public mesasCliente: any;
  public productos: Array<any>;
  public comanda: Array<any>;
  public showCarta = false;
  public dbRefDoc: AngularFirestoreDocument<any>;
  public dbRefProductos: AngularFirestoreCollection<any>;
  public mesaSolicitada: Mesa;
  public docID_Mesa: string;
  public esperaID: string;
  public mesaCliente: any;
  constructor(public mesasSrv: MesasService,public afStore: AngularFirestore,public prodSrv: ProductosService, public pedidosSrv:PedidosService) {
  }

  ngOnInit() {

    this.isOnEspera = false;
    this.mesaSolicitada = new Mesa();
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
        //Traigo mesaCliente
        this.pedidosSrv.TraerMesaCliente().subscribe( data =>{
          this.mesasCliente = data;
        });
    //TRAIGO LISTA DE ESPERA PARA CHEKEAR QUE YA ESTE O NO EN ESPERA
    this.mesasSrv.TraerListaEspera().subscribe(data => {
      //console.log(data);
      //Validar que no puede ponerse en espera una vez que se asigno a una mesa
      //CHEKEO QUE NO SE ENCUENTRE EN LISTA DE ESPERA
      this.isOnEspera = data.some( x => x.user_uid === this.currentUser.uid) ? true : false;
      console.log(this.isOnEspera);
      data.forEach(res => {
        if (res.user_uid == this.currentUser.uid) {
          this.isOnEspera = true;
          this.esperaID = res.doc_id_espera;
        }
      });
    });

    //TRAIGO MESAS PARA VER SU ESTADO
    this.mesasSrv.TraerMesas().subscribe(data => {
      this.mesas = data;
    });
    console.log(this.currentUser);
  }

  ScanQr() {
    window.cordova.plugins.barcodeScanner.scan(
      (result) => {
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
    );
    //MOCKPRUEBA //this.resolveAction("lista-espera");
  }

  AgregarProducto(index: any) {
    this.comanda.push(this.productos[index]);
    console.log(this.comanda);
  }

  resolveAction(text: string){
    const regex = /^[0-9]*$/;

    if (regex.test(text) == true) {
      var nro_Mesa = Number(text);
      text = "asignar-mesa"
    }
    switch (text) {
      case 'lista-espera':
        this.SolicitarMesa();
        break;
      case "asignar-mesa":
        this.asignarMesa(nro_Mesa);
        break;
      default:
        //Si el valor del qe es un numero se procede a asingar la mesa y se saca de la lista de espera al cliente
        //Validar que no puede ponerse en espera una vez que se asigno a una mesa
        break;
    }
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
   * Si el usuario esta en lista de espera obtiene la mesa que esta solicitando
   * Si esa mesa tiene un estado LIBRE en la coleccion mesa de firebase
   * pasa a verificar  que en la coleccion mesaCliente no activa.
   * 
   * Cuando pasa todas estas verificaciones se procede a :
   * Asignar la mesa al usuario en la coleccion mesaUsuario
   * Eliminar al cliente en lista de espera
   * Actualizar el estado de la mesa como OCUPADA.
   * 
   * Y por ultimo debe redirigir a otra pagina. 
   */

  asignarMesa(nro_mesa: number) {
    //NO FUNCIONA BIEN LA VARIABLE DE SI ESTA EN ESPERA EL USUARIO.

    if (this.isOnEspera) {
      //1 Verificar que la mesa este libre
      this.getMesa(nro_mesa);
      if (this.mesaSolicitada.estado == eEstadoMesa.LIBRE) {
        //2 verificar que la mesa no este en mesaCliente activa
        let inactiva = this.getEstadoMesaCliente(nro_mesa);

        if (inactiva == true) {

          this.mesasSrv.AsignarMesaCliente(nro_mesa, this.docID_Mesa, this.currentUser.uid);

          this.mesasSrv.EliminarClienteListaEspera(this.esperaID);

          this.mesasSrv.ActualizarMesaEstado(this.docID_Mesa, eEstadoMesa.OCUPADA);

          alert("REDIRIGIR...");

        } else {
          alert("MESA NO DISPONIBLE- esta activa con otro usuario");
        }
      } else {
        alert("MESA NO DISPONIBLE");
      }
    } else {
      alert("NO ESTA EN ESPERA");
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
  getEstadoMesaCliente(nro_mesa): boolean {
    var retorno = true;

    this.mesaCliente.forEach(mc => {
      if (mc.nro_mesa == nro_mesa) {
        if (mc.estadoMesaCliente == eEstadoMesaCliente.ACTIVA) {
          retorno = false;
        }
      }

    });
    return retorno;
  }


}
