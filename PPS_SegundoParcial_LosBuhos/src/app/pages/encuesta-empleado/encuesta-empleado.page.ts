import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { mainModule } from 'process';
import { timeout } from 'rxjs/operators';
import { Usuario } from 'src/app/clases/usuario';
import { eRol } from 'src/app/enums/eRol';
import { EncuestaService } from 'src/app/services/encuesta/encuesta.service';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { Photo } from '@capacitor/camera';
@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.page.html',
  styleUrls: ['./encuesta-empleado.page.scss'],
})
export class EncuestaEmpleadoPage implements OnInit {

  public surveyForm: FormGroup;
  public currentUser: Usuario; //Datos de la sesion
  public survey: any = {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: false
  }
  public questions: any;
  reportedUser: any;
  checkedYes: boolean = false;
  checkedNo: boolean = false;
  reportedUsername: string;
  submitted: boolean;
  showOK:boolean  = false;
  showSpinner: boolean = false;
  showForm : boolean = true;
  nroImagen: number = 0;
  images: Array<string> = [];
  errorImagen: boolean;
  constructor(private fromBuilder: FormBuilder, public route: ActivatedRoute, public encuestasSrv: EncuestaService, public router: Router,private spinner: NgxSpinnerService, private cameraService: CameraService, private storageService: StorageService) {
    this.surveyForm = this.fromBuilder.group({
      q1: [this.survey.q1, Validators.compose([Validators.required])],
      q2: [this.survey.q2, Validators.compose([Validators.required])],
      q3: [this.survey.q3, Validators.compose([Validators.required])],
      q4: [this.survey.q4, Validators.compose([Validators.required, Validators.minLength(4)])],
      q5: [this.survey.q4, Validators.compose([Validators.required])]
    })
   }

  ngOnInit() {
    //Recupera datos de sesion
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.reportedUsername = this.route.snapshot.paramMap.get('username')
    console.log(this.reportedUsername)
    this.submitted = false
    //Dependiendo el tipo de cliente la encuesta que muestro

  }

  SubmitEncuesta(){
    console.log(this.surveyForm.valid)
    this.submitted = true;
    if (!this.surveyForm.invalid) {
      let nuevoReporte = {
        comentarios: this.surveyForm.get('q4').value,
        estaContento: this.surveyForm.get('q5').value,
        orden: this.surveyForm.get('q3').value,
        limpieza: this.surveyForm.get('q2').value,
        tareasAnteriores: this.surveyForm.get('q1').value,
        userName: this.reportedUsername,
        img_src: this.images
      }
      this.encuestasSrv.NuevaEncuestaEmpleado(nuevoReporte)
      localStorage.setItem("solvedSurvey","true");
      this.ClossingMessage();
    } else {
      
    }
  }

  ClossingMessage() {
    this.spinner.show()
    setTimeout(() => {
      this.showForm = false
      this.spinner.hide()
      this.showOK = true;
      setTimeout(() => {
        this.router.navigate(['home-cocinero'])
      }, 2000);
    }, 2000);
  }

  tomarFotoProducto() {
    if (this.nroImagen < 3 ) {
      this.addPhotoToGallery();
    }
  }

  async addPhotoToGallery() {
    const photo = await this.cameraService.addNewToGallery();
    this.uploadPhoto(photo).then().catch((err) => {
      console.log("Error addPhotoToGallery", err);
    });
  }

  private async uploadPhoto(cameraPhoto: Photo) {
    this.spinner.show()
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();

    const uploadTask = this.storageService.saveFile(blob, filePath);

    console.log("nro actual de fotos cargadas: " + this.nroImagen);
    uploadTask.then(async res => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        console.log("URL  CORRECTO- i_IMG++");
        this.images.push(downloadURL);

        this.nroImagen++;
        console.log("Cantidad fotos cargadas: " + this.nroImagen + "\n URL:" + downloadURL);
        console.log(this.images);
        this.spinner.hide();
      } else {
        console.log("IMAGEN NO CORRECTA . NO SE CONTABILIZA " + this.nroImagen);
      }
      this.validarCantidadFotos();
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });
  }

  private validarCantidadFotos(): boolean {
    this.errorImagen = (this.nroImagen == 3) ? false : true;
    return this.errorImagen;
  }


  getFilePath() {
    return new Date().getTime() + '-test';
  }

}
