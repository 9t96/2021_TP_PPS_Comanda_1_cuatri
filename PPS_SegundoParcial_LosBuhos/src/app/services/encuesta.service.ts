import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Encuesta } from '../clases/encuesta';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService extends BaseService<Encuesta> {

  constructor(private fire:AngularFirestore) { 
    super(fire);
  }

  init(collName:string){
    super.setCollection(collName);
  }
}
