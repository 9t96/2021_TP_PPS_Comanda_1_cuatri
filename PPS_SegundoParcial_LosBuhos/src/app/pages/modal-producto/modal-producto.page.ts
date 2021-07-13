import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { Router } from '@angular/router';
import { Productos } from 'src/app/clases/productos';
import { eToastType } from 'src/app/enums/eToastType';
@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {
  public formProducto: FormGroup;
  public producto:any;
  public eliminar:boolean;
  public modificar:boolean; 
  public isDisabled:boolean;
  spinner: any;  
  
  public titulo:string;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(public navParams: NavParams,
              private router:Router,
              public viewCtrl: ModalController, 
              private fb: FormBuilder,
              public toastController:ToastController,
              private loadingController: LoadingController,
              private prodSrv: ProductosService) {
    
  }

  ngOnInit() {
    this.producto = this.navParams.get('producto');
    this.formProducto = this.fb.group({
      'nombre': [this.producto.nombre, [Validators.required]],
      'descripcion': [this.producto.descripcion, [Validators.required]],
      'tiempo': [this.producto.tiempo_elaboracion, [Validators.required]],
      'precio': [this.producto.precio, [Validators.required]],
      'sector': [this.producto.sector, [Validators.required]]
    });

    if(this.eliminar){
      this.titulo= "Eliminar producto";
     this.isDisabled= true;
    }else{
      this.titulo= "Modificar producto";
      this.isDisabled= false;
    }
  }
 

  dismiss() {
    this.viewCtrl.dismiss("ok");
  }

 async modificarProducto(){
    //obtener datos del modal.   
    let nombre = ( (this.formProducto.get('nombre').value).length >0 )? (this.formProducto.get('nombre').value) : this.producto.nombre;
    let descripcion = ( (this.formProducto.get('descripcion').value).length >0 )? (this.formProducto.get('descripcion').value) : this.producto.descripcion;
    let precio = ( (this.formProducto.get('precio').value).toString().length >0 )? (this.formProducto.get('precio').value) : this.producto.precio;
    let tiempo = ( (this.formProducto.get('tiempo').value).toString().length >0 )? (this.formProducto.get('tiempo').value) : this.producto.tiempo_elaboracion;
    let sector = this.formProducto.get('sector').value;

    let producto_mod= new Productos();
    producto_mod.descripcion= descripcion;
    producto_mod.nombre= nombre;
    producto_mod.precio= precio;
    producto_mod.tiempo_elaboracion= tiempo;
    producto_mod.img_src= this.producto.img_src;
    producto_mod.sector= this.producto.sector; 
    
    this.prodSrv.ActualizarProducto(producto_mod, this.producto.doc_id)
    .then(async() => {   
      this.dismiss()
      await this.presentToast("Se actualizaron los datos correctamente", eToastType.Success)
    }).catch((err) => {
      console.log(err);
      this.dismiss()
      this.presentToast("Error al actualizar elproducto", eToastType.Warning);
    }).finally(()=>{
      this.spinner.dismiss();
    });
  }

  eliminarConfirm(){
    if(confirm("¿Seguro de eliminar "+this.producto.nombre+"?")){
      this.eliminarProducto();
    }
  }
 async eliminarProducto(){  
    await this.presentLoading();
    this.spinner.present();  
      this.prodSrv.EliminarProducto(this.producto.doc_id)
      .then(async() => {   
        await this.presentToast("Se elimino el producto correctamente", eToastType.Success)
      }).catch((err) => {
        console.log(err);
        this.presentToast("Error al eliminar el producto", eToastType.Warning);
      }).finally(()=>{
        this.spinner.dismiss();
      });
 
  }

  async presentToast(message:string, type:eToastType){
    const toast = await this.toastController.create({
      color: type,
      message: message,
      duration: 2000
    });
    toast.present();
  }
    
  async presentLoading() {
    this.spinner = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
  }

}

 