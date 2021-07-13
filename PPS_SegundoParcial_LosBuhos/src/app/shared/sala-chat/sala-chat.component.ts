import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'src/app/clases/message';
import { Usuario } from 'src/app/clases/usuario';
import { eRol } from 'src/app/enums/eRol';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-sala-chat',
  templateUrl: './sala-chat.component.html',
  styleUrls: ['./sala-chat.component.scss'],
})
export class SalaChatComponent implements OnInit {

  chatForm: FormGroup;
  mensaje:string;
  mensajes:Message[];
  showSpinner:boolean;  
  bgSala:string;    
  title:string;
  @Input() user:Usuario;
  @Input() uid:string;
  @Input() mesaNumber:number;
  @Input() idMesaCliente:string;
  //@Input() idMesa:string;

  constructor(
    private mjeService: ChatService, 
    private authService:AuthService, 
    private fb:FormBuilder,
    private router:Router,
    private notificationService:NotificationsService) 
  {    
    this.mensaje="";    
    this.bgSala = "container cont-chat";    
    this.mensajes=[];
  }

  ngOnInit() {
    this.title = "Consultas Mesa " + this.mesaNumber.toString();
    this.mjeService.setChatCollection(this.idMesaCliente);

    this.mjeService.items.subscribe(
      (mje)=>{   
        //console.log(mje);     
        this.mensajes = mje;
        this.showSpinner = false;
      }
    );  

    this.chatForm = this.fb.group({
      messageCtrl:['', [Validators.required]],      
    });                
  }

  enviarMje(){           
    let mje: Message = {
      message : this.mensaje,
      userEmail : this.user.correo,
      fecha: Date.now(),
      userName:this.user.nombre + ' ' + this.user.apellido,
      //idMesa:this.idMesa,
      idMesa:"",
      Mesa: this.mesaNumber.toString(),
      uid: this.uid,
      rol: this.user.rol == eRol.CLIENTE? "Cliente" : "Mozo",
      mesaClienteId: this.idMesaCliente
    };  
    
    this.mjeService.setItemWithId(mje, mje.fecha.toString())
    .then(() => {
      if(this.user.rol == eRol.CLIENTE){
        this.notificationService.sendNotification(
          "Consulta",
          mje.message,
          'mozo'
        );
      }      
    });    

    this.mensaje = "";
  }

  getMessageCtrl(){
    return this.chatForm.controls["messageCtrl"];
  }

  return(){
    this.router.navigate(["home-clientes"]);
  }

  clickLogout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    });
  }

}
