import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {


  public dbRefmesacliente: AngularFirestoreCollection<any>;
  constructor(public afStore: AngularFirestore) { 
    this.dbRefmesacliente = this.afStore.collection("mesaCliente");
  }

  TraerMesaCliente(): Observable<any>{
    return this.dbRefmesacliente.valueChanges({idField: 'doc_id'});
  }

  GenerarPedido(doc_id:string, comanda:Array<any>){
    //this.dbRefProductos = this.afStore.collection("mesaCliente");
    //this.dbRefProductos.valueChanges().subscribe(res => {console.log(res)});
    //this.dbRefProductos.update({ productos: [{nombre:"coca",tipo:"BEBIDA",precio:"100"},{nombre:"ravioles",tipo:"COCINA",precio:"350"},{nombre:"flan",tipo:"POSTRE",precio:"150"}]})
    this.afStore.doc(`mesaCliente/${doc_id}`).update({productos: comanda})
  }

  
}
