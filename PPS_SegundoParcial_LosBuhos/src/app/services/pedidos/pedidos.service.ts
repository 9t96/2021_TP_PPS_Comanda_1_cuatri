import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';

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

  //Cambia estado de mesaCliente
  CambiarEstadoMesaCli(doc_id:string,estado:eEstadoMesaCliente){
    this.afStore.doc(`mesaCliente/${doc_id}`).update({estado: estado})
  }

  TraerPedido(doc_id:string):Observable<any>{
    //this.dbRefProductos = this.afStore.collection("mesaCliente");
    //this.dbRefProductos.valueChanges().subscribe(res => {console.log(res)});
    //this.dbRefProductos.update({ productos: [{nombre:"coca",tipo:"BEBIDA",precio:"100"},{nombre:"ravioles",tipo:"COCINA",precio:"350"},{nombre:"flan",tipo:"POSTRE",precio:"150"}]})
    return this.afStore.doc(`mesaCliente/${doc_id}`).valueChanges({idField: "doc_id"});
  }

  CerrarMesa(doc_id:string){
    return this.afStore.doc(`mesaCliente/${doc_id}`).delete();
  }

  ActualizarEstadoJuego(doc_id:string){
    this.afStore.doc(`mesaCliente/${doc_id}`).update({ganoJuego: true});
  }

  
}
