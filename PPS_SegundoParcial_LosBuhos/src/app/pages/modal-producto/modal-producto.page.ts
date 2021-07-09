import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.page.html',
  styleUrls: ['./modal-producto.page.scss'],
})
export class ModalProductoPage implements OnInit {

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


  dismiss() {
    this.viewCtrl.dismiss(this.producto);
  }
    

}

 