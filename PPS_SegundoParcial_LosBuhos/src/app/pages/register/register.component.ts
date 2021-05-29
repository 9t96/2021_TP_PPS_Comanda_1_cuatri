import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { Rol } from 'src/app/enums/roles';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    
  form1:FormGroup;
  form2:FormGroup;
  spinner: any;  
  user:Usuario;
  formSelected:number;
  imagenPerfil = "../../../assets/bulldog francés.jpg";
  uploadProgress:number;
  hasErrorPerfil:boolean;

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
      this.user = new Usuario();   
      this.user.rol = Rol.CLIENTE; 
      this.user.apellido =''; // porque sino al guardar rope al ser undefined
      this.user.dni = '';  // porque sino al guardar rope al ser undefined
      this.formSelected = 1;       
      this.hasErrorPerfil = false;                
  }

  ngOnInit() {
    this.createForm();    
  }

  tomarFotoPerfil(){
    this.addPhotoToGallery();
  }

  escanearClick(){
    console.log("usuario: " + this.user.img_src);
    console.log(this.form1);
  }

  createForm() {
    this.form1 = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [ Validators.minLength(2)]],      
      dni:['', [ Validators.max(999999999), Validators.min(1000000), Validators.pattern("^[0-9]*$")]],
    });

    this.form2 = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      pass1: ["", [Validators.required, Validators.minLength(6)]],         
      pass2: ["", [Validators.required, Validators.minLength(6)]]
    },
    {
      validator: this.MustMatch('pass1', 'pass2')
    });
  }

  async registrarseClick(){        
    await this.presentLoading();
    this.spinner.present();
    
    this.authService.CreaterUser(this.user.correo, this.getPass1Control().value)
    .then((credential) => {        
      //console.log(credential.user.);      
      this.userService.addItem(this.user);
      //this.userService.setItemWithId(this.user, credential.credential.providerId);
    }).catch((err) => {
      console.log(err);
      this.presentToast("Error al registrar el usuario");
    }).finally(()=>{
      this.spinner.dismiss();
    });
  }

  async presentToast(message:string){
    const toast = await this.toastController.create({
      color: 'warning',
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

  getEmailControl() { return this.form2.controls["email"]; }
  getPass1Control() { return this.form2.controls["pass1"]; }
  getPass2Control() { return this.form2.controls["pass2"]; }

  getNameControl() { return this.form1.controls["name"]; }    
  getLastNameControl() { return this.form1.controls["lastName"]; }
  getDniControl() { return this.form1.controls["dni"]; }
  

  goToLogin(){ 
    this.router.navigate(['login']);
    this.ngOnInit();
   }

   goTo(idPage:number){
     switch(idPage){
      case 0:
         this.goToLogin();
         break;
      case 1:
          this.formSelected = 1;
          break;
      case 2:
          if(this.user.img_src != null){
            this.formSelected = 2;
          }
          else{
            this.hasErrorPerfil = true;
          }
          
          break;
     }
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

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

}
