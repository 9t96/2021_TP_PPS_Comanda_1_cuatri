import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
}
