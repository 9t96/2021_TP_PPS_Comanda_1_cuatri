import { NgModule } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos/productos.service'; 
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Productos } from 'src/app/clases/productos';

import { ModalProductoPage } from './../modal-producto/modal-producto.page'
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalConfirmRemovePage } from 'src/app/pages/modal-confirm-remove/modal-confirm-remove.page';
import { ToastService } from 'src/app/services/toast/toast.service';
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
              public modalController: ModalController, public router: Router, public toastSrv: ToastService){ }

  ngOnInit() {

    this.prodSrv.TraerProductos().subscribe( data =>{
      this.isLoaded = true;
      this.productoSeleccionado =false;
      this.productos = data;
      console.log(data);
    });
  }

  public ModificarProducto(doc_id:string):void{
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

  public NavigateNuevoProd() {
    this.router.navigate(['producto-alta'])
  }

  async ConfirmRemove(doc_id:string) {
    const modalRemove = await this.modalController.create({
      component: ModalConfirmRemovePage,
      cssClass: 'modal-confirm-remove',
      componentProps: { }
      });
      modalRemove.onDidDismiss().then(data=>{
          if(data.data){
            this.RemoveProducto(doc_id);
            this.toastSrv.presentToast("Se elimino con exito el producto",2000,"success")
          }
      })
      return await modalRemove.present();
  }

  RemoveProducto(doc_id:string){
    this.prodSrv.EliminarProducto(doc_id)
  }



  async openModal(producto:Productos) {
    const modal = await this.modalController.create({
    component: ModalProductoPage,
    cssClass: 'modificar-producto-modal',
    componentProps: { producto: producto , eliminar: false , modificar: true}
    });
    modal.onDidDismiss().then(data=>{
      console.log(data)
    })
    return await modal.present();
  }
}
