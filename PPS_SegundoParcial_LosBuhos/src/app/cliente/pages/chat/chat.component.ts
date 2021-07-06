import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  mesasCliente: any;
  currentMesaCliente: any;
  currentUser: Usuario;
  currentUid:string;

  constructor(private pedidosSrv:PedidosService, private authService:AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUid = this.authService.getUid();

    this.pedidosSrv.TraerMesaCliente().subscribe( data =>{
      this.mesasCliente = data;  
      console.log(this.mesasCliente);           
      this.currentMesaCliente = this.mesasCliente.find( x =>  x.user_uid == this.currentUid)      
    });
  }

}
