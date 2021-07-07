import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../clases/usuario';
import { eRol } from '../enums/eRol';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<Usuario>{

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

  updateUser(user:Usuario, uid:string){
    return this.setItemWithId(user, uid);
  }

  async deleteCurrentUser(){
    await this.deleteItem(localStorage.getItem("uid"))
    .then(() =>{
      localStorage.removeItem("userData");
      localStorage.removeItem("uid");
    });
  }

  deleteUser(uid:string){
    return this.deleteItem(uid); 
  }
}
