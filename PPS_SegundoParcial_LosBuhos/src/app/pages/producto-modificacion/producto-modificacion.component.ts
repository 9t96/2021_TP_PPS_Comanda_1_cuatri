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

  public modificarProducto(doc_id:string):void{
    let obj = this.productos.findIndex( x => x.doc_id == doc_id);
    if (obj !== -1) {
      console.log(obj)
      this.saveProdIndex = obj;
      console.log(this.saveProdIndex)
      this.openModal(this.productos[obj])
    } else {
      console.log("no existe")
    }   
  }



  async openModal(producto:Productos) {
    const modal = await this.modalController.create({
    component: ModalProductoPage,
    cssClass: 'my-modal-class',
    componentProps: { producto: producto , eliminar: false , modificar: true}
    });
    modal.onDidDismiss().then(data=>{
      console.log(data)
      this.productos[this.saveProdIndex] = data.data;
    })
    return await modal.present();
  }
}
