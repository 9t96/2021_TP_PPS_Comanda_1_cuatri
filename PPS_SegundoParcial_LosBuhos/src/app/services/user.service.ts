import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { eRol } from '../enums/eRol';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<any>{

  constructor(private fire:AngularFirestore) { 
    super(fire);
    this.setCollection("users");
  }

  async getUserByEmail(email:string){
    return this.getItemByFilter("email", email).then();
  }

  getUserByUid(uid:string){
    return this.getItem(uid);
  }

  getClientesByStatus(aceptado:boolean){
    return this.itemsCollection.ref
      .where("rol",'==', eRol.CLIENTE)
      //.where("aceptado",'==', eRol.CLIENTE)
      .get();
  }
}
