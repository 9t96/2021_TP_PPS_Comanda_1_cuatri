import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  saveFile(file:Blob, filePath:string){    
    return this.storage.upload(filePath, file);
  }
}
