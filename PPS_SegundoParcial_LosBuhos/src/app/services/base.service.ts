import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {

    protected itemsCollection: AngularFirestoreCollection<T>;
    items: Observable<T[]>;  


    constructor(private afs: AngularFirestore) {
      
    }

    protected setCollection(collName:string){
      this.itemsCollection = this.afs.collection<T>(collName);
      this.items = this.itemsCollection.valueChanges({idField: "uid"});
    }

    protected setCollectionOrderBy(collName:string, field:string){
      this.itemsCollection = this.afs.collection<T>(collName, ref => ref.orderBy(field, "desc"));
      this.items = this.itemsCollection.valueChanges();
    }

    protected setCollFilter(valueFilter:string, collName:string, field:string, filterField:string){
      this.itemsCollection = this.afs.collection<T>(collName, ref => ref
        .where(filterField, '==', valueFilter)
        .orderBy(field, "desc"));
      this.items = this.itemsCollection.valueChanges();
    }
  
    getItemByFilter(campo:string, value:any){
      return this.itemsCollection.ref.where(campo,'==',value).get();
    }

    addItem(item: T) {
      return this.itemsCollection.add(Object.assign({}, item));    
    }

    setItemWithId(item: T, id:string) {
      return this.itemsCollection.doc(id).set(Object.assign({}, item));    
    }
    
    protected getItem(id:string):Observable<Usuario>{
      return this.itemsCollection.doc<Usuario>(id).valueChanges({idField: "uid"});
    }

    protected getItemById(id:string){
      return this.itemsCollection.doc<T>(id).get();
    }

    deleteItem(id:string){
      return this.itemsCollection.doc(id).delete();
    }

    /*
    < menor que
    <= menor o igual que
    == igual que
    > mayor que
    >= mayor que o igual que
    != no igual a
    array-contains
    array-contains-any
    in
    not-in

    this.service.items.subscribe((items) =>{
      // array de json
      console.log(items);
    });

    this.peliculaService.getItemByFilter("campo", valor).then((querySnapshot)=>{
      querySnapshot.forEach((doc) => {        
        console.log(doc.id, " => ", doc.data());        
      });            
    }).catch((err)=>{
      console.log(err);
    });

    */
}
