import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {

  @Output() addProducto = new EventEmitter();
  @Input() productos: any;

  constructor() { }

  ngOnInit() {}

  AgregarProducto(){
    this.addProducto.emit("esteseria el producto");
  }

}
