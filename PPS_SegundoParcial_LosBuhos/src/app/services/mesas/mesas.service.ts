import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  public dbRefMesas: AngularFirestoreCollection<any>;
  public dbRefEspera: AngularFirestoreCollection<any>;

  public dbRefMesaCliente: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRefMesas = this.afStore.collection("mesas");
    this.dbRefEspera = this.afStore.collection("listaEspera");
    this.dbRefMesaCliente = this.afStore.collection("mesaCliente");
  }

    TraerMesas(): Observable<any>{
      return this.dbRefMesas.valueChanges({idField: "doc_id_mesa"});
    }

    GuardarNuevaMesa(nuevaMesa: Mesa): any{
      return this.dbRefMesas.add(Object.assign({},nuevaMesa));
    }

    TraerListaEspera(): Observable<any>{
      return this.dbRefEspera.valueChanges({idField: "doc_id_espera"})
    }

    SolicitarMesa(currentUser: any){
      return this.dbRefEspera.add({user_uid: currentUser.uid, nombre: currentUser.nombre, apellido: currentUser.apellido, img_src: currentUser.img_src});
    }

    EliminarClienteListaEspera(id_doc){
      this.dbRefEspera.doc(id_doc).delete();
    }
  
    AsignarMesaCliente( nro_Mesa:number, id_mesa:string, id_usuario:string){
      this.dbRefMesaCliente.add({user_uid: id_usuario, id_mesa: id_mesa ,nro_Mesa:nro_Mesa, estadoMesaCliente: eEstadoMesaCliente.ACTIVA});
    }

    TraerMesaCliente(): Observable<any>{
      return this.dbRefMesaCliente.valueChanges({idField: "doc_id_mesaCliente"});
    }

    ActualizarMesaEstado(mesaID:string, est:eEstadoMesa){
      this.dbRefMesas.doc(mesaID).update({estado: est});
    }
}
