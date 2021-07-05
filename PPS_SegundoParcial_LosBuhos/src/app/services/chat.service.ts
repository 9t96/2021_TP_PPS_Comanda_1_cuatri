import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../clases/message';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService<Message> {

  constructor(private fire: AngularFirestore){
    super(fire);    
  } 

  setCollName(collName:string){
    this.setCollection(collName);
  }

  getMessagesByRoom(idRoom:number){
    return this.getItemByFilter("sala", idRoom).then();
  }
}
