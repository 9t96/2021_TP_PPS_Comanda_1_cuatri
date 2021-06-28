import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Productos } from 'src/app/clases/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  public dbRef: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRef = this.afStore.collection("productos");
  }

    TraerProductos(): Observable<any>{
      return this.dbRef.valueChanges();
    }

    GuardarNuevoProducto(nuevaProd: Productos): any{
      return this.dbRef.add(Object.assign({},nuevaProd));
    }
}
 