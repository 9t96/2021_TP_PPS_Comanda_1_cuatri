import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Encuesta } from 'src/app/clases/encuesta';
import { eLoMejorPeor } from 'src/app/enums/eLoMejorPeor';
import { eToastType } from 'src/app/enums/eToastType';
import { eValoracionComidas } from 'src/app/enums/eValoracionComidas';
import { eValoracionVelocidad } from 'src/app/enums/eValoracionVelocidad';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { MesaClienteService } from 'src/app/services/mesa-cliente.service';
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
  mesaClienteId:string;

  constructor(private bf:FormBuilder, 
    private userService:UserService, 
    private encuestaService:EncuestaService,
    private mesaClienteService: MesaClienteService,
    private router:Router,
    private route: ActivatedRoute,
    public toastController:ToastController) { 
      this.showSpinner = false;
      this.recomienda = false;
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

    this.encuestaService.addItem(encuesta).then(async() => {
      this.showSpinner = false;
      this.disableControls(false); 
      await this.mesaClienteService.setEncuesta(this.mesaClienteId, true);
      await this.presentToast("Encuesta guardada correctamente", eToastType.Success);
      this.return();
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
}
