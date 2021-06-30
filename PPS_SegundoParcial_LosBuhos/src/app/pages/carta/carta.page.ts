import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
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
  public mesaActual: any;
  public demoraEstimada: number = 0;
  constructor(public prodSrv: ProductosService,public mesaSrv:MesasService, public pedidosSrv: PedidosService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userData'));
    this.mesaActual = this.route.snapshot.paramMap.get('mesa')
    //Traigo productos
    this.prodSrv.TraerProductos().subscribe( data => {
      this.productos = data;
      this.productos.forEach( x => {
        x.cantidad = 0;
        x.selected = false;
      })
    });
    //Traigo mesa-cliente
    this.pedidosSrv.TraerMesaCliente().subscribe( mesas => {
      this.mesasCliente = mesas;
      this.currentMesaClient = this.mesasCliente.find( x => {
        return x.nro_mesa == this.mesaActual
      })
      console.log(this.currentMesaClient)
    })
  }

  // AddProducto(index:number){
  //   let prodIndex = this.comanda.findIndex( x =>  x.nombre === this.productos[index].nombre)
  //   console.log("id si existe en comanda" + prodIndex)
  //   if (prodIndex !== -1) {
  //     this.comanda[prodIndex].cantidad,this.productos[index].cantidad = this.productos[index].cantidad-1
  //     console.log("mas uno comanda si existe" + this.comanda[prodIndex].cantidad )
  //     //this.productos[index].cantidad+=1;
  //     console.log("mas uno prod" + this.productos[index].cantidad)
  //   } else {
  //     this.productos[index].cantidad = 1;
  //     this.comanda.push(this.productos[index])
  //   }
  //   this.total += this.productos[index].precio;
  //   console.log("comanda despues de agregar " + Object.assign({},this.comanda))
  //   this.CalcularDemora();
  // }

  // RemoveProducto(nombre:string,index:number){
  //   if(this.productos[index].cantidad > 0){
  //     this.productos[index].cantidad--; 
  //     let cmndIndex = this.comanda.findIndex(x => x.nombre == nombre)
  //     if (this.comanda[cmndIndex].cantidad > 1) {
  //       this.comanda[cmndIndex].cantidad--;
  //     } else {
  //       const auxCom = this.comanda.filter( x => { return x.nombre !== nombre})
  //       this.comanda = auxCom;
  //       console.log(this.comanda)
  //     }
  //     this.total -= this.productos[index].precio;
  //     console.log("comanda despues de eliminar " + this.comanda)
  //     this.CalcularDemora();
  //   }
  // }

  AddProducto(index:number){
    this.productos[index].selected = true;
    this.productos[index].cantidad++;
    this.total += this.productos[index].precio;

    //  let prodIndex = this.comanda.findIndex( x =>  x.nombre === this.productos[index].nombre)
    //  console.log("id si existe en comanda" + prodIndex)
    //  if (prodIndex !== -1) {
    //    this.comanda[prodIndex].cantidad,this.productos[index].cantidad = this.productos[index].cantidad-1
    //    console.log("mas uno comanda si existe" + this.comanda[prodIndex].cantidad )
    //    //this.productos[index].cantidad+=1;
    //    console.log("mas uno prod" + this.productos[index].cantidad)
    //  } else {
    //    this.productos[index].cantidad = 1;
    //    this.comanda.push(this.productos[index])
    //  }
    //  this.total += this.productos[index].precio;
    //  console.log("comanda despues de agregar " + Object.assign({},this.comanda))
     this.CalcularDemora();
  }
  RemoveProducto(nombre:string,index:number){
     if(this.productos[index].cantidad > 0){
       this.productos[index].cantidad--;
       if(this.productos[index].cantidad == 0){
        this.productos[index].selected = false;
       }
       this.total -= this.productos[index].precio;
       this.CalcularDemora();
     }
  }

  CalcularDemora(){
    let prodSelected = 0;
    this.productos.forEach(x =>{
      prodSelected += (x.selected ? 1 : 0);
    })
    this.demoraEstimada = prodSelected > 0 ? Math.max.apply(Math, this.productos.map( x => { return (x.selected ? x.tiempo_elaboracion : null)})) : 0
  }

  EnviarPedido(){
    //Falta validar que la comanda tenga productos
    let prodSelected = 0;
    this.productos.forEach(x =>{
      prodSelected += (x.selected ? 1 : 0);
    })
    if(prodSelected > 0){
      this.pedidosSrv.GenerarPedido(this.currentMesaClient.doc_id,this.productos.filter( x=> { return x.selected == true}))
      this.pedidosSrv.CambiarEstadoMesaCli(this.currentMesaClient.doc_id, eEstadoMesaCliente.CONFIRMANDO_PEDIDO);
    }
    else{
      console.log("ERROR NO TIENE PRODUCTOS EN CARRTITO");
    }
  }
  


}
