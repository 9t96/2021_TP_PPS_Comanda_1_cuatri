import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Productos } from 'src/app/clases/productos';

 
@Injectable({
  providedIn: 'root'
})
export class ProductosService{
  items: Observable<any[]>; 
  public dbRef: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth
  ) {
    this.dbRef = this.afStore.collection("productos");
  }

    TraerProductos(): Observable<any>{
      return this.dbRef.valueChanges({idField: "doc_id"});
    }

    GuardarNuevoProducto(nuevaProd: Productos): any{
      return this.dbRef.add(Object.assign({},nuevaProd));
    }

    CambiarEstadoProducto(doc_id:string, productos:any){
      this.afStore.doc(`mesaCliente/${doc_id}`).update({productos: productos })
    }

    async  EliminarProducto(id_doc):Promise<boolean>{
      
      this.dbRef.doc(id_doc).delete().then(() =>{
            return true;
          });
          return false;
    }

    async ActualizarProducto(producto:Productos, id_doc){
        this.afStore.doc(`productos/${id_doc}`).update({
          nombre: producto.nombre,
          img_src: producto.img_src,
          descripcion: producto.descripcion,
          sector: producto.sector,
          precio: producto.precio,
          tiempo_elaboracion : producto.tiempo_elaboracion
        }); 
    } 
    setItemWithId(item: any, id:string) {
      return this.dbRef.doc(id).set(Object.assign({}, item));    
    }
 
}
 