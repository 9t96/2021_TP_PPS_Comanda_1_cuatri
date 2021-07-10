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

  constructor(navParams: NavParams,
              private router:Router,
              public viewCtrl: ModalController, 
              private fb: FormBuilder,
              public toastController:ToastController,
              private loadingController: LoadingController,
              private prod_srv:ProductosService) {
    //son los datos que ya me llegan del prod a modifcar
    this.producto=navParams.get('producto');
 
  }

  ngOnInit() {
    this.formProducto = this.fb.group({
      'nombre': ['', [Validators.required]],
      'descripcion': ['', [Validators.required]],
      'tiempo': ['', [Validators.required]],
      'precio': ['', [Validators.required]],
      'sector': ['', [Validators.required]]
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
    this.viewCtrl.dismiss(this.producto);
  }

 async modificarProducto(){
  await this.presentLoading();
  this.spinner.present();    
    //obtener datos del modal.   
    let nombre:string= ( (this.formProducto.get('nombre').value).length >0 )? (this.formProducto.get('nombre').value) : this.producto.nombre;
    let descripcion:string = ( (this.formProducto.get('descripcion').value).length >0 )? (this.formProducto.get('descripcion').value) : this.producto.descripcion;
    let precio:number = ( (this.formProducto.get('precio').value).toString().length >0 )? (this.formProducto.get('precio').value) : this.producto.precio;
    let tiempo:number= ( (this.formProducto.get('tiempo').value).toString().length >0 )? (this.formProducto.get('tiempo').value) : this.producto.tiempo_elaboracion;
    //let sector:eProducto = this.formProducto.get('sector').value;
    //  let imagenes= 

    let producto_mod= new Productos();
    producto_mod.descripcion= descripcion;
    producto_mod.nombre= nombre;
    producto_mod.precio= precio;
    producto_mod.tiempo_elaboracion= tiempo;
    producto_mod.img_src= this.producto.img_src;
    producto_mod.sector= this.producto.sector; 
    
    this.prod_srv.updateProducto( producto_mod, this.producto.doc_id)
    .then(async() => {   
      await this.presentToast("Se actualizaron los datos correctamente", eToastType.Success)
    }).catch((err) => {
      console.log(err);
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
      this.prod_srv.EliminarProducto(this.producto.doc_id)
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

 