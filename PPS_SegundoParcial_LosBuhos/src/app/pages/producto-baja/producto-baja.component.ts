import { Component, OnInit , Input,EventEmitter , Output} from '@angular/core'; 
import { Productos } from 'src/app/clases/productos';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { FormsModule } from '@angular/forms';

import { IonicModule, ModalController } from '@ionic/angular'; 
import { ModalProductoPage } from './../modal-producto/modal-producto.page'

@Component({
  selector: 'app-producto-baja',
  templateUrl: './producto-baja.component.html',
  styleUrls: ['./producto-baja.component.scss'],
})
export class ProductoBajaComponent implements OnInit {

  public productos: Array<any>;
  public isLoaded: boolean = false;
  public saveProdIndex: any;
 
 
  constructor(public prodSrv: ProductosService,
    public modalController: ModalController) { }

  ngOnInit() {

    this.prodSrv.TraerProductos().subscribe( data =>{
      this.isLoaded = true;
      this.productos = data;
      console.log(data);
    });
  }


  public eliminarProducto(doc_id:string):void{
    let obj = this.productos.findIndex( x => x.doc_id == doc_id);
    if (obj !== -1) {
      console.log(obj)
      this.saveProdIndex = obj;
      console.log(this.saveProdIndex)
      this.openModal(this.productos[obj])
    } else {
      console.log("no existe");
    }   
  }



  async openModal(producto:Productos) {
    const modal = await this.modalController.create({
    component: ModalProductoPage,
    cssClass: 'my-modal-class',
    componentProps: { producto: producto , eliminar: true , modificar: false }
    });
    modal.onDidDismiss().then(data=>{
      console.log(data)
      this.productos[this.saveProdIndex] = data.data;
    })
    return await modal.present();
  }



}
