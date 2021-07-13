import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Encuesta } from 'src/app/clases/encuesta';
import { eLoMejorPeor } from 'src/app/enums/eLoMejorPeor';
import { eToastType } from 'src/app/enums/eToastType';
import { eValoracionComidas } from 'src/app/enums/eValoracionComidas';
import { EncuestaService } from 'src/app/services/encuesta.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent implements OnInit {

  @ViewChild('pieChart', {static: true}) pieChart;
  @ViewChild('barChart', {static: true}) barChart;
  @ViewChild('barChartVertical', {static: true}) barChartVertical;
  @ViewChild('donutChart', {static: true}) donutChart;

  barsVertical: Chart
  bars: Chart;
  pie: Chart;
  donut: Chart;

  dataCalidadComida: Array<any>;
  dataRecomienda: Array<any>;
  dataPuntajeMozo: Array<any>;
  dataLoMejor: Array<any>;
  comentarios: string[];
  fotos: string[];

  encuestas:Encuesta[];

  constructor(
    private router:Router,
    private spinner: NgxSpinnerService,
    public toastController:ToastController,
    private encuestaService:EncuestaService
  ) { 
    this.encuestas = [];
    this.fotos = [];
    this.comentarios = [];
    this.encuestaService.init("encuesta-cliente");
  }

  ngOnInit() {
    this.spinner.show();
    this.encuestaService.items.subscribe((items) => {
      console.log(items);
      this.evalDestroy();
      this.initValues();
      this.encuestas = items;

      this.encuestas.forEach((element) => {
        switch (element.loMejor) {
          case eLoMejorPeor.APP:
            this.dataLoMejor[0]++;
            break;
          case eLoMejorPeor.ATENCION:
            this.dataLoMejor[3]++;
            break;
          case eLoMejorPeor.INSTALACIONES:
            this.dataLoMejor[2]++;
            break;
          case eLoMejorPeor.COMIDA:
            this.dataLoMejor[1]++;
            break;
        }
        switch (element.recomienda) {
          case true:
            this.dataRecomienda[0]++;
            break;
          case false:
            this.dataRecomienda[1]++;
            break;
        }
        switch (element.valoracionComidas) {
          case eValoracionComidas.MUYBUENA:
            this.dataCalidadComida[0]++;
            break;
          case eValoracionComidas.BUENA:
            this.dataCalidadComida[1]++;
            break;
          case eValoracionComidas.REGULAR:
            this.dataCalidadComida[2]++;
            break;
          case eValoracionComidas.MALA:
            this.dataCalidadComida[3]++;
            break;
        }
        this.dataPuntajeMozo[element.puntajeMozo-1]++;

        if(element.comentarios != ''){
          this.comentarios.push(element.comentarios);
        }
        if(element.srcFotos?.length){
          element.srcFotos.forEach((foto) => {
            this.fotos.push(foto);
          });
        }
      })
      
      this.createPieChart()
      this.createBarChartHorizontal()
      this.createBarChartVertical()
      this.createDoughnutChart()
      this.spinner.hide();
    });
  }

  /* Comida */
  createPieChart() {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: [eValoracionComidas.MUYBUENA, eValoracionComidas.BUENA, eValoracionComidas.REGULAR, eValoracionComidas.MALA],
        datasets: [{
          data: [this.dataCalidadComida[0],this.dataCalidadComida[1],this.dataCalidadComida[2] ,this.dataCalidadComida[3]],
          backgroundColor: [
            'rgb(54, 235, 116)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)'
          ],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '¿Cómo calificaría a la calidad de la comida?'
          }
        }
      }
    });
  }
  /* Recomienda */
  createBarChartHorizontal() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Si', 'No'],
        datasets: [{
          label: '',
          data: [this.dataRecomienda[0],this.dataRecomienda[1]],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)'
          ],
        }]
      },
      options: {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '¿Recomendaría el Restaurante?'
          }
        }
      }
    });
  }
  /* Mozo */
  createBarChartVertical() {
    this.barsVertical = new Chart(this.barChartVertical.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5' ,'6' ,'7' ,'8' ,'9' ,'10'],
        datasets: [{
          label: '',
          data: [this.dataPuntajeMozo[0],this.dataPuntajeMozo[1],this.dataPuntajeMozo[2],this.dataPuntajeMozo[3],this.dataPuntajeMozo[4],this.dataPuntajeMozo[5],this.dataPuntajeMozo[6],this.dataPuntajeMozo[7],this.dataPuntajeMozo[8],this.dataPuntajeMozo[9]],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '¿Qué puntaje le asignaría al mozo?'
          }
        }
      }
    });
  }
  /* Lo Mejor */
  createDoughnutChart() {
    this.donut = new Chart(this.donutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [eLoMejorPeor.APP, eLoMejorPeor.COMIDA, eLoMejorPeor.INSTALACIONES, eLoMejorPeor.ATENCION],
        datasets: [{
          label: 'Cumplimiento de tareas entre los empleados',
          data: [this.dataLoMejor[0],this.dataLoMejor[1],this.dataLoMejor[2],this.dataLoMejor[3]],
          backgroundColor: [
            'rgb(54, 235, 116)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)'
          ],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '¿Qué destacaría como positivo?'
          }
        }
      }
    });
  }

  evalDestroy(){
    if(this.pie){
      this.pie.destroy();
    }
    if(this.donut){
      this.donut.destroy();
    }
    if(this.bars){
      this.bars.destroy();
    }
    if(this.barsVertical){
      this.barsVertical.destroy();
    }
  }

  initValues(){
    this.dataCalidadComida = [0,0,0,0];
    this.dataRecomienda = [0,0];
    this.dataPuntajeMozo = [0,0,0,0,0,0,0,0,0,0];
    this.dataLoMejor = [0,0,0,0];
    this.comentarios =  [];
    this.fotos = [];
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
}
