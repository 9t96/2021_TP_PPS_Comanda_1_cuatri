import { Component, OnInit } from '@angular/core';
import { eProducto } from 'src/app/enums/eProducto';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ProductosService } from 'src/app/services/productos/productos.service';

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
  constructor(public prodSrv: ProductosService,public mesaSrv:MesasService, public pedidosSrv: PedidosService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    //Traigo productos
    this.prodSrv.TraerProductos().subscribe( data => {
      this.productos = data;
      this.productos.forEach( x => {
        x.cantidad = 0;
      })
    });
    //Traigo mesa-cliente
    this.pedidosSrv.TraerMesaCliente().subscribe( mesas => {
      this.mesasCliente = mesas;
      this.currentMesaClient = this.mesasCliente.find( x => {
        return x.user_uid = this.currentUser.uid
      })
    })
  }

  AddProducto(index:number){
    let prodIndex = this.comanda.findIndex( x => { return x.nombre === this.productos[index].nombre})
    if (prodIndex !== -1) {
      this.comanda[prodIndex].cantidad++;
    } else {
      this.productos[index].cantidad = 1;
      this.comanda.push(this.productos[index])
    }
    this.total += this.productos[index].precio;
    console.log(this.comanda)
  }

  RemoveProducto(nombre:string,index:number){
    this.productos[index].cantidad--; 
    let cmndIndex = this.comanda.findIndex(x => x.nombre == nombre)
    if (this.comanda[cmndIndex].cantidad > 1) {
      
      this.comanda[cmndIndex].cantidad--;
    } else {
      const auxCom = this.comanda.filter( x => { x.nombre !== nombre})
      this.comanda = auxCom;
      console.log(this.comanda)
    }
    this.total -= this.productos[index].precio;

  }

  EnviarPedido(){
    this.pedidosSrv.GenerarPedido(this.currentMesaClient.doc_id,this.comanda)
  }
  


}
