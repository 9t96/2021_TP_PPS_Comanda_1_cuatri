import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  public dbRef: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRef = this.afStore.collection("reporte-sobre-empleados");
  }


  AgregarNuevoReporte(nuevoReporte: any){
    this.dbRef.add(nuevoReporte);
  }

  TrearReportes() :Observable<any>{
    return this.dbRef.valueChanges();
  }
}
