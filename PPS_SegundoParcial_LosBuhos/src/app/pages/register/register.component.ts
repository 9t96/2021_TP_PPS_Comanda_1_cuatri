import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  //registerData: RegisterData;
  passConfirmation: string;
  form1:FormGroup;
  form2:FormGroup;
  spinner: any;
  pass:string;
  user:Usuario;
  formSelected:number;
  srcTest = "../../../assets/bulldog francés.jpg";
  uploadProgress:number;
  log = "log";

  constructor(
    private authService:AuthService, 
    public toastController:ToastController,
    private router:Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private cameraService:CameraService,
    private storageService: StorageService
    ) {    
      this.user = new Usuario();  
      this.formSelected = 1;           
  }

  ngOnInit() {
    //this.registerData = new RegisterData();  
    this.createForm();
  }

  tomarFotoPerfil(){
    this.addPhotoToGallery();
  }

  escanearClick(){

  }

  createForm() {
    this.form1 = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [ Validators.minLength(2)]],
      //selfie: ["", [Validators.required]],
      dni:['', [ Validators.max(999999999), Validators.min(1000000), Validators.pattern("^[0-9]*$")]],
    });

    this.form2 = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      pass1: ["", [Validators.required, Validators.minLength(6)]],   
      //genero: ["", [Validators.required]],
      pass2: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  async registrarseClick(){        
    await this.presentLoading();
    this.spinner.present();
    await this.registrarse();
  }

  registrarse(){
    // this.authService.Registrarse(this.registerData).then((value)=>{
    //   if (value.ok){      
    //     this.router.navigate(['home']);
    //     this.ngOnInit();
    //   }
    //   else{
    //     this.presentToast(value.error.description);
    //   }
    // })
    // .catch((err)=>{
    //   console.log(err);
    // })
    // .finally(()=>{
    //   this.spinner.dismiss();
    // });
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
  //getSelfieControl() { return this.form1.controls["selfie"]; }
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
          this.formSelected = 2;
          break;
     }
   }

   async addPhotoToGallery() {
    const photo = await this.cameraService.addNewToGallery();
    this.uploadPhoto(photo).then().catch((err) => {
      this.log = err;
    });
  }

  private async uploadPhoto(cameraPhoto: Photo) {    
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();
    
    const uploadTask = this.storageService.saveFile(blob, filePath);    
    
    uploadTask.percentageChanges().subscribe(change =>{
      this.uploadProgress = change;
    });

    uploadTask.then(async res =>{
      const downloadURL = await res.ref.getDownloadURL();
      this.user.img_src = downloadURL;
      this.srcTest = downloadURL;
      // await this.savePhotoData(downloadURL, filePath).then(async res =>{
      //   const toast = await this.toastController.create({
      //     duration:3000,
      //     message: "Se completó la subida"
      //   });
      //   toast.present();
      // });
    })
    .catch((err)=>{
      this.log = err;
    });    
  }

  getFilePath(){
    return new Date().getTime() + '-test';
  }

  // private async savePhotoData(fileUrl:string, fileName:string){
  //   let data:PhotoData = new PhotoData();

  //   data.date = Date.now();
  //   data.photoUrl = fileUrl;
  //   data.points = 0;
  //   data.type = type;
  //   data.userEmail = this.userEmail;
  //   data.userName = this.userName;
  //   data.photoName = fileName;

  //   return this.photoDataService.addItem(data);
  // }
}
