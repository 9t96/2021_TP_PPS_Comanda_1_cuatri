import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'src/app/clases/message';
import { Usuario } from 'src/app/clases/usuario';
import { eRol } from 'src/app/enums/eRol';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat.service';

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
  @Input() mesaNumber:string;
  @Input() idMesaCliente:string;
  //@Input() idMesa:string;

  constructor(
    private mjeService: ChatService, 
    private authService:AuthService, 
    private fb:FormBuilder,
    private router:Router) 
  {
    this.title = "Consultas mesa Nro. " + this.mesaNumber;
    this.mensaje="";    
    this.bgSala = "container cont-chat bg-sala-b";    
    this.mensajes=[];
  }

  ngOnInit() {
    this.mjeService.setCollName(this.idMesaCliente);

    this.mjeService.items.subscribe(
      (mje)=>{   
        //console.log(mje);     
        this.mensajes = mje;
        this.showSpinner = false;
      }
    );  

    this.chatForm = this.fb.group({
      messageCtrl:['', []],      
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
      Mesa: this.mesaNumber,
      uid: this.uid,
      rol: this.user.rol == eRol.CLIENTE? "Cliente" : "Mozo"
    };  
    
    this.mjeService.setItemWithId(mje, mje.fecha.toString());    

    this.mensaje = "";
  }

  getMessageCtrl(){
    return this.chatForm.controls["messageCtrl"];
  }

  goToHome(){
    this.router.navigate(["home-clientes"]);
  }

  clickLogout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    });
  }

}
