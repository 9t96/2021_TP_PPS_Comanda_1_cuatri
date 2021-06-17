import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { MesasService } from 'src/app/services/mesas/mesas.service';
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
  constructor(public mesasSrv: MesasService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    //TRAIGO LISTA DE ESPERA PARA CHEKEAR QUE YA ESTE O NO EN ESPERA
    this.mesasSrv.TraerListaEspera().subscribe( data=>{
      console.log(data);
      //Validar que no puede ponerse en espera una vez que se asigno a una mesa
      //CHEKEO QUE NO SE ENCUENTRE EN LISTA DE ESPERA
      this.isOnEspera = data.some( x => x.user_uid === this.currentUser.uid) ? true : false;
      console.log(this.isOnEspera);
    })

    //TRAIGO MESAS PARA VER SU ESTADO
    this.mesasSrv.TraerMesas().subscribe( data =>{
      this.mesas = data;
    })
    console.log(this.currentUser);
  }

  ScanQr(){
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

  resolveAction(text:string){
    switch (text) {
      case "lista-espera":
        this.SolicitarMesa();
        break;
      default:
        //Si el valor del qe es un numero se procede a asingar la mesa y se saca de la lista de espera al cliente
        //Validar que no puede ponerse en espera una vez que se asigno a una mesa
        break;
    }
  }

  SolicitarMesa(){
    if (!this.isOnEspera) {
      this.mesasSrv.SolicitarMesa(this.currentUser);
    } else {
      console.log("YA SE ENCUENTRA EN LISTA DE ESPERA");
      //Error usted ya se encuentra en lista de espera.
    }
  }


 



}
