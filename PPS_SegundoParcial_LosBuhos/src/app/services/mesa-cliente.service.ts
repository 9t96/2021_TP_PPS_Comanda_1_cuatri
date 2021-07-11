import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MesaClienteService extends BaseService<any>{

  constructor(private fire:AngularFirestore) { 
    super(fire);
    this.setCollection("mesaCliente");
  }

  public setEncuesta(id:string, hasEncuesta:boolean){
    return this.itemsCollection.doc(id).update({hasEncuesta: hasEncuesta});
  }
}
