import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { eEmpleado } from 'src/app/enums/eEmpleado';
import { eRol } from 'src/app/enums/eRol';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
declare let window: any;

@Component({
  selector: 'app-registro-empleado',
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.scss'],
})
export class RegistroEmpleadoComponent implements OnInit {

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
      this.user.apellido = '';
      this.user.dni = '';
        
      this.formSelected = 0; 
      this.hasErrorPerfil = false;                
  }

  ngOnInit() {
    this.createForm();    
  }

  tomarFotoPerfil(){    
    this.addPhotoToGallery();
  }

  escanearClick(){
    window.cordova.plugins.barcodeScanner.scan(
      (result) => {
        var dniData = result.text.split('@');
        this.form1.patchValue({
          name: dniData[2],
          lastName: dniData[1],      
          dni: dniData[4],
          cuil: this.getCuil(dniData[4], dniData[8]) 
        });
      },
      (err) => {
        console.log(err);
        this.presentToast("Error al escanear el DNI");
      },
      {
        showTorchButton: true,
        prompt: 'Scan your code',
        formats: 'PDF_417',
        resultDisplayDuration: 2,
      }
    );
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

    this.form2 = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      pass1: ["", [Validators.required, Validators.minLength(6)]],         
      pass2: ["", [Validators.required, Validators.minLength(6)]]
    },
    {
      validator: this.MustMatch('pass1', 'pass2')
    });
  }

  getEmailControl() { return this.form2.controls["email"]; }
  getPass1Control() { return this.form2.controls["pass1"]; }
  getPass2Control() { return this.form2.controls["pass2"]; }

  getNameControl() { return this.form1.controls["name"]; }    
  getLastNameControl() { return this.form1.controls["lastName"]; }
  getDniControl() { return this.form1.controls["dni"]; }
  getCuilControl() { return this.form1.controls["cuil"]; }

  async registrarseClick(){        
    await this.presentLoading();
    this.spinner.present();
    
    this.authService.CreaterUser(this.user.correo, this.getPass1Control().value)
    .then((credential) => {   
      this.userService.setItemWithId(this.user, credential.user.uid);
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

  setRol(rol:string){
    switch(rol){
      case "DUEÑO":
        this.user.rol = eRol.DUEÑO;
        break;
      case "SUPERVISOR":
        this.user.rol = eRol.SUPERVISOR;
        break;
      case "MOZO":
        this.user.rol = eRol.EMPLEADO;
        this.user.tipo_empleado = eEmpleado.MOZO;
        break;
      case "BARTENDER":
        this.user.rol = eRol.EMPLEADO;
        this.user.tipo_empleado = eEmpleado.BARTENDER;
        break;
      case "COCINERO":
        this.user.rol = eRol.EMPLEADO;
        this.user.tipo_empleado = eEmpleado.COCINERO;
        break;
    }
    
    this.goTo(1);
  }

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
          if(this.user.rol == eRol.DUEÑO){
            if(this.user.img_src != null){
              
            }
            else{
              this.hasErrorPerfil = true;
            }
          }else{
            this.formSelected = 2;
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
