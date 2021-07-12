import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  public dbRef: AngularFirestoreCollection<any>;
  public dbRefEmp: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRef = this.afStore.collection("reporte-sobre-empleados");
    this.dbRefEmp = this.afStore.collection("encuesta-empleados");
  }


  AgregarNuevoReporte(nuevoReporte: any){
    this.dbRef.add(nuevoReporte);
  }

  TrearReportes() :Observable<any>{
    return this.dbRef.valueChanges();
  }

  NuevaEncuestaEmpleado(nuevoReporte: any){
    this.dbRefEmp.add(nuevoReporte);
  }

  TrearReportesEmpleados() :Observable<any>{
    return this.dbRefEmp.valueChanges();
  }
}
