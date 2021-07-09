import { NgModule } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos/productos.service'; 
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Productos } from 'src/app/clases/productos';

import { ModalProductoPage } from './../modal-producto/modal-producto.page'
import { ModalController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-producto-modificacion',
  templateUrl: './producto-modificacion.component.html',
  styleUrls: ['./producto-modificacion.component.scss'],
})
export class ProductoModificacionComponent implements OnInit {
  public productos: Array<any>;
  public isLoaded: boolean = false;
  public formProducto: FormGroup;
  public productoSeleccionado:boolean=false;
  public item:Productos;
  public saveProdIndex: any;

  @Input() producto_mod:Productos;
  constructor(public prodSrv: ProductosService, 
              private fb: FormBuilder,
              public modalController: ModalController){ }

  ngOnInit() {

    this.prodSrv.TraerProductos().subscribe( data =>{
      this.isLoaded = true;
      this.productoSeleccionado =false;
      this.productos = data;
      console.log(data);
    });
  }

  public modificarProducto():void{
    alert(this.producto_mod);
    let productttt= new Productos();
    productttt.descripcion="BEBIDA GASEOSA";
    productttt.nombre= "COCA COLA";
    productttt.precio= 15;
    productttt.tiempo_elaboracion = 3;

    this.productoSeleccionado = true;
    //alert(this.item.nombre);
    let obj = productttt;//this.productos.findIndex( x => x.doc_id ==producto);
    this.openModal(productttt);
    //  this.productoModificar = item;
     
  }



  async openModal(producto:Productos) {
    const modal = await this.modalController.create({
    component: ModalProductoPage,
    cssClass: 'my-modal-class',
    componentProps: { producto: producto }
    });
    modal.onDidDismiss().then(data=>{
      console.log(data)
      this.productos[this.saveProdIndex] = data.data;
     // this.CalcularDemora();
      //this.CalcularTotal();
    })
    return await modal.present();
  }
}
