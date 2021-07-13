import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Encuesta } from 'src/app/clases/encuesta';
import { eLoMejorPeor } from 'src/app/enums/eLoMejorPeor';
import { eToastType } from 'src/app/enums/eToastType';
import { eValoracionComidas } from 'src/app/enums/eValoracionComidas';
import { eValoracionVelocidad } from 'src/app/enums/eValoracionVelocidad';
import { CameraService } from 'src/app/services/camera.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { MesaClienteService } from 'src/app/services/mesa-cliente.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
})
export class EncuestaComponent implements OnInit {

  public encuestaForm: FormGroup;
  alertMessage:string;
  alertMessageOK:string;
  valoracionComidasOpt:string[];
  valoracionVelocidadOpt:string[];
  loMejorPeorOpt:string[];
  recomienda:boolean;
  mesaClienteId:string;
  srcPothos:string[];

  constructor(private bf:FormBuilder, 
    private userService:UserService, 
    private encuestaService:EncuestaService,
    private mesaClienteService: MesaClienteService,
    private router:Router,
    private route: ActivatedRoute,
    public toastController:ToastController,
    private storageService: StorageService,
    private cameraService: CameraService,
    private spinner: NgxSpinnerService) { 
      this.recomienda = false;
      this.srcPothos = [];
    }

  ngOnInit(): void {
    this.mesaClienteId = this.route.snapshot.paramMap.get('mesaClienteId');
    this.alertMessage = "";
    this.alertMessageOK = "";
    this.initOpciones();
    
    this.encuestaService.init("encuesta-cliente");

    this.encuestaForm = this.bf.group({
      puntajeMozo:['', [Validators.required]],
      valoracionComidas:['', [Validators.required]],      
      loMejor:['', [Validators.required]],      
      comentarios:['', [Validators.maxLength(30)]],
      recomienda:['']
    });
  }

  clickGuardarEncuesta(){
    this.disableControls(true);
    this.spinner.show();

    let encuesta: Encuesta = new Encuesta();
    encuesta.loMejor = this.getLoMejor().value;    
    encuesta.puntajeMozo = this.getPuntajeMozo().value;
    encuesta.recomienda = this.recomienda;
    encuesta.valoracionComidas = this.getValoracionComidas().value;    
    encuesta.comentarios = this.getComentarios().value;
    encuesta.srcFotos = this.srcPothos;

    this.encuestaService.addItem(encuesta).then(async() => {
      this.disableControls(false); 
      await this.mesaClienteService.setEncuesta(this.mesaClienteId, true);
      await this.presentToast("Encuesta guardada correctamente", eToastType.Success);
      this.return();
    }).catch((err)=>{
      console.log(err);
      this.presentToast("Error al guardar encuesta", eToastType.Warning);
    })
    .finally(() => {
      this.spinner.hide();
    });
  }

  disableControls(disable:boolean){
    if(disable){
      this.getPuntajeMozo().disable();
      this.getValoracionComidas().disable();
      this.getLoMejor().disable();      
      this.getRecomienda().disable();      
      this.getComentarios().disable();
    }else{
      this.getPuntajeMozo().enable();
      this.getValoracionComidas().enable();
      this.getLoMejor().enable();      
      this.getRecomienda().enable();  
      this.getComentarios().enable();    
    }
  }

  getPuntajeMozo(){
    return this.encuestaForm.get("puntajeMozo");
  }

  getValoracionComidas(){
    return this.encuestaForm.get("valoracionComidas");
  }

  getLoMejor(){
    return this.encuestaForm.get("loMejor");
  }

  getComentarios(){
    return this.encuestaForm.get("comentarios");
  }
  
  getRecomienda(){
    return this.encuestaForm.get("recomienda");
  }

  return(){
    this.router.navigate(['home-clientes']);
  }

  async presentToast(message:string, type:eToastType){
    const toast = await this.toastController.create({
      color: type,
      message: message,
      duration: 2000
    });
    toast.present();
  }

  setRecomienda(){
    this.recomienda = !this.recomienda;
  }

  initOpciones(){
    this.valoracionComidasOpt = [
      eValoracionComidas.MUYBUENA,
      eValoracionComidas.BUENA,
      eValoracionComidas.REGULAR,
      eValoracionComidas.MALA,
    ];

    this.valoracionVelocidadOpt = [
      eValoracionVelocidad.RAPIDA,
      eValoracionVelocidad.NORMAL,
      eValoracionVelocidad.LENTA,
      eValoracionVelocidad.MUYLENTA,
    ];

    this.loMejorPeorOpt = [
      eLoMejorPeor.COMIDA, 
      eLoMejorPeor.ATENCION,
      eLoMejorPeor.APP,
      eLoMejorPeor.INSTALACIONES
    ];
  }

  takePhoto(){
    if(this.srcPothos.length < 3){
      this.addPhotoToGallery()
      .then(()=>{

      })
      .catch((err)=>{
        console.log(err);
        this.presentToast("No se pudo guardar la foto", eToastType.Warning)
      });
    }
    else{
      this.presentToast("No puede cargar más de 3 fotos", eToastType.Warning);
    }
  }

  async addPhotoToGallery() {
    const photo = await this.cameraService.addNewToGallery();
    this.uploadPhoto(photo)
      .then()
      .catch((err) => {
        console.log(err);
      });
  }

  private async uploadPhoto(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();

    const uploadTask = this.storageService.saveFile(blob, filePath);

    uploadTask
      .then(async (res) => {
        const downloadURL = await res.ref.getDownloadURL();
        this.srcPothos.push(downloadURL);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFilePath() {
    return new Date().getTime() + '-encuesta';
  }
}
