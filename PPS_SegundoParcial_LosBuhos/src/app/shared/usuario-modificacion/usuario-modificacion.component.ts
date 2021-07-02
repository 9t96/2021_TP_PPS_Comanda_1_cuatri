import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { eToastType } from 'src/app/enums/eToastType';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-usuario-modificacion',
  templateUrl: './usuario-modificacion.component.html',
  styleUrls: ['./usuario-modificacion.component.scss'],
})
export class UsuarioModificacionComponent implements OnInit {
  form1:FormGroup;  
  spinner: any;  
  formSelected:number;
  imagenPerfil = "../../../assets/images/pngegg.png";
  uploadProgress:number;
  hasErrorPerfil:boolean;
  @Input() user:Usuario;

  constructor(
    private authService:AuthService, 
    public toastController:ToastController,
    private router:Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private cameraService:CameraService,
    private storageService: StorageService,
    private userService:UserService    
    ) {    
      this.formSelected = 1; 
      this.hasErrorPerfil = false;                
  }

  ngOnInit() {
    this.createForm();    
  }

  tomarFotoPerfil(){    
    this.addPhotoToGallery();
  }

  getCuil(dni:string, dataCuil:string){
    return dataCuil.slice(0, 2) + dni + dataCuil.slice(2);
  }

  createForm() {
    this.form1 = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],      
      dni:['', [Validators.required, Validators.max(999999999), Validators.min(1000000), Validators.pattern("^[0-9]*$")]],
      cuil:['',[Validators.required, Validators.minLength(10), Validators.maxLength(15) , Validators.pattern("^[0-9]*$")]]
    });
  }

  getNameControl() { return this.form1.controls["name"]; }    
  getLastNameControl() { return this.form1.controls["lastName"]; }
  getDniControl() { return this.form1.controls["dni"]; }
  getCuilControl() { return this.form1.controls["cuil"]; }

  async updateUser(){        
    await this.presentLoading();
    this.spinner.present();    
    
    this.userService.updateCurrentUser(this.user)    
    .then(async() => {   
      await this.presentToast("Se actualizaron los datos correctamente", eToastType.Success)
    }).catch((err) => {
      console.log(err);
      this.presentToast("Error al actualizar el usuario", eToastType.Warning);
    }).finally(()=>{
      this.spinner.dismiss();
    });
  }

  async deleteUser(){        
    await this.presentLoading();
    this.spinner.present();    
    
    this.authService.deleteUser()    
    .then(async() => {  
      await this.userService.deleteCurrentUser(); 
      await this.presentToast("Se borró la cuenta correctamente", eToastType.Success)
      this.router.navigate(['login']);
    }).catch((err) => {
      console.log(err);
      this.presentToast("Error al borrar la cuenta", eToastType.Warning);
    }).finally(()=>{
      this.spinner.dismiss();
    });
  }


  async presentToast(message:string, type:eToastType){
    const toast = await this.toastController.create({
      color: type,
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.spinner = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
  }

   async addPhotoToGallery() {
    const photo = await this.cameraService.addNewToGallery();
    this.uploadPhoto(photo).then().catch((err) => {
      console.log(err);
    });
  }

  private async uploadPhoto(cameraPhoto: Photo) {    
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();
    
    const uploadTask = this.storageService.saveFile(blob, filePath);    

    uploadTask.then(async res =>{
      const downloadURL = await res.ref.getDownloadURL();
      this.user.img_src = downloadURL;
      this.hasErrorPerfil = false;
    })
    .catch((err)=>{
      console.log(err);
    });    
  }

  getFilePath(){
    return new Date().getTime() + '-test';
  }

  logout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }
}
