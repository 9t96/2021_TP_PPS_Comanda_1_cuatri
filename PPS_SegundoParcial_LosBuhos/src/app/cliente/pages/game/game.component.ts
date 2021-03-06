import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  srcBase:string = "../../../../assets/game-images/";
  srcPiedra:string = this.srcBase + "piedra.jpg";
  srcPapel:string = this.srcBase + "papel.jpg";
  srcTijera:string = this.srcBase + "tijera.jpg";
  srcIncognita:string;
  srcResultado:string;
  bloquear:boolean;
  triunfos:number;
  derrotas:number;
  empates:number;
  userName:string;
  juegoIniciado:boolean;
  doc_id: any;
  currentUid: string;
  mesasCliente: any;
  currentMesaCliente: any;
  //registroJuego:RegistroJuego;

  constructor(
    //private userService:UsersService, private registroService: RegistroService,
    private router:Router,
    private spinner: NgxSpinnerService,
    public toastSrv: ToastService,
    public pedidosSrv: PedidosService,
    public authService: AuthService
    ) { 
    this.triunfos = 0;
    this.derrotas = 0;
    this.empates = 0;
    //this.registroJuego = new RegistroJuego();   
    this.juegoIniciado = false;
    this.setInitialStatus();
  }

  ngOnInit(): void {
    this.currentUid = this.authService.getUid();

    this.pedidosSrv.TraerMesaCliente().subscribe( data =>{
      this.mesasCliente = data;             
      this.currentMesaCliente = this.mesasCliente.find( x =>  x.user_uid == this.currentUid)
    });
    // this.userName = this.userService.currentUser.name;
    // this.registroJuego.juego = "Piedra, Papel o Tijera";
    // this.registroJuego.juegoId = 1;
    // this.registroJuego.userEmail = this.userService.currentUser.email;
    // this.registroJuego.userName = this.userName;

    // this.registroService.setCollection("registro-"+this.registroJuego.userEmail);
  }

  chose(id:number){

    if(!this.bloquear){
      this.executeLogic(id);
    }
  }

  executeLogic(id:number){
    this.bloquear = true;
    let seconds = 2;
    let maquina = this.getRandomInt(1,3);

    switch(maquina){
      case 1:
        this.srcIncognita = this.srcPiedra;
        break;
      case 2:
        this.srcIncognita = this.srcPapel;
        break;
      case 3:
        this.srcIncognita = this.srcTijera;
        break;
    }

    let resultado: number = this.getResultado(id, maquina);

    switch(resultado){
      case 0:
        this.empates++;
        seconds = 1;
        this.srcResultado = "";
        break;
      case 1:
        this.triunfos++;
        this.srcResultado = this.srcBase + "ganar.jpg";
        break;
      case 2:
        this.derrotas++;
        this.srcResultado = this.srcBase + "perder.jpg";
        break;      
    }
    if (this.derrotas >= 3) {
      this.spinner.show()
      this.toastSrv.presentToast("La maquina gano no hay descuento", 2500, "danger")
      this.spinner.hide();
    }   
    else if(this.triunfos >= 3){
      this.spinner.show();
      this.toastSrv.presentToast("!Ganaste! Se te aplicara un 10% de descuento", 2500, "danger")
      this.pedidosSrv.ActualizarEstadoJuego(this.currentMesaCliente.doc_id);
      this.router.navigate(['home-clientes'])
      this.spinner.hide();
    } 

    this.waitTime(seconds);
  }

  getResultado(humano:number, maquina:number):number{
    if(humano != maquina){
      this.juegoIniciado = true;
    }
    if(humano == maquina){
      return 0;
    }
    if(humano == 1 && maquina == 3){
      return 1;
    }
    else if(humano == 2 && maquina == 1){
      return 1;
    }
    else if(humano == 3 && maquina == 2){
      return 1;
    }
    else{
      return 2;
    }
  }

  getRandomInt(min, max) : number{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

  setInitialStatus(){
    this.bloquear = false;
     
    this.srcIncognita = this.srcBase + "incognita.jpg";
    this.srcResultado ="";
    
  }

  waitTime(seconds:number){
    setTimeout( () => { 
      this.setInitialStatus();
    }, seconds*1000 );
  }
  
  public guardarRegistroDelJuego(){
    // this.registroJuego.derrotas = this.derrotas;
    // this.registroJuego.victorias = this.triunfos;
    // this.registroJuego.empates = this.empates;
    // this.registroJuego.fechaHora = Date.now();

    // this.registroService.addItem(this.registroJuego);
  }

  return(){
    this.router.navigate(['home-clientes']);
  }

}
