import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
    return this.getItemById(uid);
  }

  getClientesByStatus(aceptado:boolean){
    return this.itemsCollection.ref
      .where("rol",'==', eRol.CLIENTE)
      .where("aceptado",'==', false)
      .get();
  }

  async updateCurrentUser(user:Usuario){
    await this.setItemWithId(user, localStorage.getItem("uid"))
    .then(() =>{
      localStorage.setItem("userData",JSON.stringify(user));
    });
  }
}
