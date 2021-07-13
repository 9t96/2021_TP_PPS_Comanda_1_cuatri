import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-confirm-remove',
  templateUrl: './modal-confirm-remove.page.html',
  styleUrls: ['./modal-confirm-remove.page.scss'],
})
export class ModalConfirmRemovePage implements OnInit {

  constructor(public viewCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss(respuesta:string){
    if(respuesta == 'yes'){
      this.viewCtrl.dismiss(true);
    }
    else {
      this.viewCtrl.dismiss(false);
    }
    
  }

}
