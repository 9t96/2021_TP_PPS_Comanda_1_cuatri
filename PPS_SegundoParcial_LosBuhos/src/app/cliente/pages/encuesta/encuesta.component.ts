import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Encuesta } from 'src/app/clases/encuesta';
import { eToastType } from 'src/app/enums/eToastType';
import { EncuestaService } from 'src/app/services/encuesta.service';
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
  showSpinner:boolean;
  valoracionComidasOpt:string[];
  valoracionVelocidadOpt:string[];
  loMejorPeorOpt:string[];
  recomienda:boolean;

  constructor(private bf:FormBuilder, 
    private userService:UserService, 
    private encuestaService:EncuestaService,
    private router:Router,
    public toastController:ToastController) { 
      this.showSpinner = false;
      this.recomienda = false;
    }

  ngOnInit(): void {
    this.alertMessage = "";
    this.alertMessageOK = "";
    this.initOpciones();
    
    this.encuestaService.init("encuesta-cliente");

    this.encuestaForm = this.bf.group({
      puntajeMozo:['', [Validators.required]],
      valoracionComidas:['', [Validators.required]],
      valoracionVelocidad:['', [Validators.required]],
      loMejor:['', [Validators.required]],
      loPeor:['', [Validators.required]],
      recomienda:['']
    });
  }

  clickGuardarEncuesta(){
    this.disableControls(true);
    this.showSpinner = true;

    let encuesta: Encuesta = new Encuesta();
    encuesta.loMejor = this.getLoMejor().value;
    encuesta.loPeor = this.getLoPeor().value;
    encuesta.puntajeMozo = this.getPuntajeMozo().value;
    encuesta.recomienda = this.recomienda;
    encuesta.valoracionComidas = this.getValoracionComidas().value;
    encuesta.valoracionVelocidad = this.getValoracionVelocidad().value;

    this.encuestaService.addItem(encuesta).then(() => {
      this.showSpinner = false;
      this.disableControls(false); 
      this.presentToast("Encuesta guardada correctamente", eToastType.Success);
    }).catch((err)=>{
      console.log(err);
      this.presentToast("Error al guardar encuesta", eToastType.Warning);
    });
  }

  disableControls(disable:boolean){
    if(disable){
      this.getPuntajeMozo().disable();
      this.getValoracionComidas().disable();
      this.getLoMejor().disable();
      this.getLoPeor().disable();
      this.getRecomienda().disable();
      this.getValoracionVelocidad().disable();
    }else{
      this.getPuntajeMozo().enable();
      this.getValoracionComidas().enable();
      this.getLoMejor().enable();
      this.getLoPeor().enable();
      this.getRecomienda().enable();
      this.getValoracionVelocidad().enable();
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

  getLoPeor(){
    return this.encuestaForm.get("loPeor");
  }
  
  getRecomienda(){
    return this.encuestaForm.get("recomienda");
  }

  getValoracionVelocidad(){
    return this.encuestaForm.get("valoracionVelocidad");
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
      "Muy buena", "Buena", "Regular", "Mala"
    ];

    this.valoracionVelocidadOpt = [
      "Rápida", "Normal", "Lenta", "Muy lenta"
    ];

    this.loMejorPeorOpt = [
      "La comida", "La atención", "Las instalaciones", "La aplicación para celular"
    ];
  }
}
