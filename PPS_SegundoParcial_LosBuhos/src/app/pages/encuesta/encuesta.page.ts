import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mainModule } from 'process';
import { timeout } from 'rxjs/operators';
import { Usuario } from 'src/app/clases/usuario';
import { eRol } from 'src/app/enums/eRol';
import { EncuestaService } from 'src/app/services/encuesta/encuesta.service';
@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

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
  constructor(private fromBuilder: FormBuilder, public route: ActivatedRoute, public encuestasSrv: EncuestaService, public router: Router) {
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
        cumpleHorario: this.surveyForm.get('q5').value,
        realizaTareas: this.surveyForm.get('q3').value,
        limpieza: this.surveyForm.get('q2').value,
        respeta: this.surveyForm.get('q1').value,
        userName: this.reportedUsername
      }
      this.encuestasSrv.AgregarNuevoReporte(nuevoReporte)
      this.ClossingMessage();
    } else {
      
    }
  }

  ClossingMessage() {
    this.showForm = false
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false
      this.showOK = true;
      setTimeout(() => {
        this.router.navigate(['supervisor/users'])
      }, 2000);
    }, 2000);
  }

  //Guarda una nueva mesa.
  GuardarNuevaMesa() {
    /* this.nuevaMesa.nro_mesa = this.mesasForm.get('nro_mesa').value;
    this.nuevaMesa.comensales = this.mesasForm.get('comensales').value;
    this.nuevaMesa.tipo_mesa = this.mesasForm.get('tipo_mesa').value; */
  }

  ResetearFormulario() {
/*  this.mesasForm.reset(); //Reseteo form
    this.nuevaMesa = new Mesa();
    let mesanuevanro = this.mesasList.length + 1;
    this.mesasForm.get('comensales').setValue(null);
    this.mesasForm.get('tipo_mesa').setValue(-1);
    this.mesasForm.get('nro_mesa').setValue(mesanuevanro);
    this.mesasForm.get('estado').setValue(this.nuevaMesa.estado); */
  }

}
