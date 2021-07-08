import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  title:string;

  constructor(private pedidosSrv:PedidosService, 
    private authService:AuthService,
    private router:Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    //console.log("nro de mesa",this.route.snapshot.paramMap.get('nroMesa'));
    this.currentUser = this.authService.getCurrentUser();
    this.currentUid = this.authService.getUid();

    this.pedidosSrv.TraerMesaCliente().subscribe( data =>{
      this.mesasCliente = data;             
      this.currentMesaCliente = this.mesasCliente.find( x =>  
        x.nro_mesa == this.route.snapshot.paramMap.get('nroMesa'));      
      this.title = "Mesa " + this.currentMesaCliente.nro_mesa;
    });

    
  }

  return(){
    this.router.navigate(["home-mozo"]);
  }
}
