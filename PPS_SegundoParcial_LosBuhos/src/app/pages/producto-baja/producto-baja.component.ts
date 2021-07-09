import { Component, OnInit , Input,EventEmitter , Output} from '@angular/core'; 
import { Productos } from 'src/app/clases/productos';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-producto-baja',
  templateUrl: './producto-baja.component.html',
  styleUrls: ['./producto-baja.component.scss'],
})
export class ProductoBajaComponent implements OnInit {

  public productos: Array<any>;
  public isLoaded: boolean = false;

//  @Input()  itemProducto: Productos;
  //@Output() itemProductoChange = new EventEmitter<any>();
 
  constructor(public prodSrv: ProductosService) { }

  ngOnInit() {

    this.prodSrv.TraerProductos().subscribe( data =>{
      this.isLoaded = true;
      this.productos = data;
      console.log(data);
    });
  }


  /*resize( itemProducto:Productos) {
    this.itemProducto = new Productos();
    this.itemProductoChange.emit(this.itemProducto);
  }*/

  eliminarProducto(doc_id:string){
    alert("hola, va a eliminar "+doc_id);
  }




}
