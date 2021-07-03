import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-producto-modificacion',
  templateUrl: './producto-modificacion.component.html',
  styleUrls: ['./producto-modificacion.component.scss'],
})
export class ProductoModificacionComponent implements OnInit {
  public productos: Array<any>;
  public isLoaded: boolean = false;
 
  constructor(public prodSrv: ProductosService) { }

  ngOnInit() {

    this.prodSrv.TraerProductos().subscribe( data =>{
      this.isLoaded = true;
      this.productos = data;
      console.log(data);
    });
  }

}
