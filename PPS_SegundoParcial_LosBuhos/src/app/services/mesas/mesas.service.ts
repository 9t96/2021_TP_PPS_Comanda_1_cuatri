import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  public dbRef: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRef = this.afStore.collection("mesas");
  }

    TraerMesas(): Observable<any>{
      return this.dbRef.valueChanges();
    }

    GuardarNuevaMesa(nuevaMesa: Mesa): any{
      return this.dbRef.add(Object.assign({},nuevaMesa));
    }
  
}
