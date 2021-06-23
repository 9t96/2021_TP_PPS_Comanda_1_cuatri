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
  public dbRefMesas: AngularFirestoreCollection<any>;
  public dbRefEspera: AngularFirestoreCollection<any>;
  public dbRefmesacliente: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRefMesas = this.afStore.collection("mesas");
    this.dbRefEspera = this.afStore.collection("listaEspera");
    this.dbRefmesacliente = this.afStore.collection("mesaCliente");
  }

    TraerMesas(): Observable<any>{
      return this.dbRefMesas.valueChanges();
    }

    GuardarNuevaMesa(nuevaMesa: Mesa): any{
      return this.dbRefMesas.add(Object.assign({},nuevaMesa));
    }

    TraerListaEspera(): Observable<any>{
      return this.dbRefEspera.valueChanges({idField: "doc_id"})
    }

    SolicitarMesa(currentUser: any){
      return this.dbRefEspera.add({user_uid: currentUser.uid, nombre: currentUser.nombre, apellido: currentUser.apellido, img_src: currentUser.img_src});
    }

    TraerMesaCliente(): Observable<any>{
      return this.dbRefmesacliente.valueChanges();
    }
  
}
