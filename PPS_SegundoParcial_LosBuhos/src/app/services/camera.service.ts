import { Injectable } from '@angular/core';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {  

  constructor() {}

  public async addNewToGallery() :Promise<Photo> {
    const capturedPhoto  = await Camera.getPhoto ({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 100,
    });
    return capturedPhoto;
  }
  
}
