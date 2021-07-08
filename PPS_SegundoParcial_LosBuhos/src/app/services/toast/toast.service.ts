import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController:ToastController) { }

  async presentToast(message:string,duration:number,color:string){
    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: duration
    });
    toast.present();
  }
}
