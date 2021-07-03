import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  ngOnInit() {
  }

  producto:any
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(navParams: NavParams,public viewCtrl: ModalController) {

    this.producto=navParams.get('producto')
    console.log(this.producto)

  }

  AddProducto(){
    if (this.producto.cantidad > 0) {
      this.producto.cantidad++;
    }
    else{
      this.producto.selected = true;
      this.producto.cantidad++;
    }
  }

  RemoveProducto(){
    if(this.producto.cantidad > 0){
      this.producto.cantidad--;
      if(this.producto.cantidad == 0){
       this.producto.selected = false;
      }
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.producto);
  }
    

}
