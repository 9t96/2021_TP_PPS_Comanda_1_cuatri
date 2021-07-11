import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { EncuestaService } from 'src/app/services/encuesta/encuesta.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  @ViewChild('pieChart', {static: true}) pieChart;
  @ViewChild('barChart', {static: true}) barChart;
  @ViewChild('barChartVertical', {static: true}) barChartVertical;
  @ViewChild('donutChart', {static: true}) donutChart;
  public showClientes: boolean = false
  public showEmpleados: boolean = false;
  public showSupervisor: boolean = false;
  barsVertical: any
  bars: any;
  pie: any;
  donut: any;
  colorArray: any;
  dataRespeto: Array<any> = [0,0,0];
  dataHorario: Array<any> = [0,0];
  dataLimpieza: Array<any> = [0,0,0,0,0,0,0,0,0,0];
  dataTareas: Array<any> = [0,0,0];
  selected: string;
  reportes: any;
  constructor(public encuestaSrv: EncuestaService) { }

  ngOnInit() {
    this.selected = "supervisor"
    this.encuestaSrv.TrearReportes().subscribe( data =>{
      this.reportes = data;
      data.forEach(element => {
        switch (element.respeta) {
          case 'AVECES':
            this.dataRespeto[1]++;
            break;
          case 'SIEMPRE':
            this.dataRespeto[0]++;
            break;
          case 'POCASVECES':
            this.dataRespeto[2]++;
            break;
        }
        switch (element.cumpleHorario) {
          case true:
            this.dataHorario[0]++;
            break;
          case false:
            this.dataHorario[1]++;
            break;
        }
        switch (element.realizaTareas) {
          case 'SIEMPRE':
            this.dataTareas[0]++;
            break;
          case 'GENERALMENTE':
            this.dataTareas[1]++;
            break;
          case 'POCASVECES':
            this.dataTareas[2]++;
            break;
        }
        this.dataLimpieza[element.limpieza-1]++;
      });
      this.showSupervisor = true;
      this.createPieChart()
      this.createBarChartHorizontal()
      this.createBarChartVertical()
      this.createDoughnutChart()
    })
  }

  createPieChart() {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Siempre', 'A veces', 'Pocas veces'],
        datasets: [{
          label: '¿Que tanto se respetan entre los empleados?',
          data: [this.dataRespeto[0],this.dataRespeto[1],this.dataRespeto[2]],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '¿Que tanto se respetan entre los empleados?'
          }
        }
      }
    });
  }

  createBarChartHorizontal() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Si', 'No'],
        datasets: [{
          data: [this.dataHorario[0],this.dataHorario[1]],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
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
            text: 'Cuantos empleados cumplen el horario'
          }
        }
      }
    });
  }

  createBarChartVertical() {
    this.barsVertical = new Chart(this.barChartVertical.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5' ,'6' ,'7' ,'8' ,'9' ,'10'],
        datasets: [{
          data: [this.dataLimpieza[0],this.dataLimpieza[1],this.dataLimpieza[2],this.dataLimpieza[3],this.dataLimpieza[4],this.dataLimpieza[5],this.dataLimpieza[6],this.dataLimpieza[7],this.dataLimpieza[8],this.dataLimpieza[9]],
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
            text: 'Indice de limpieza entre empleados'
          }
        }
      }
    });
  }

  createDoughnutChart() {
    this.donut = new Chart(this.donutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Siempre', 'Generalmente', 'Pocas veces'],
        datasets: [{
          label: 'Cumplimiento de tareas entre los empleados',
          data: [this.dataTareas[0],this.dataTareas[1],this.dataTareas[2]],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Cumplimiento de tareas entre los empleados'
          }
        }
      }
    });
  }

  ShowClientes(){
    this.showClientes = true;
    this.showEmpleados = false;
    this.showSupervisor = false
  }

  ShowEmpleados(){
    this.showClientes = false;
    this.showEmpleados = true;
    this.showSupervisor = false
  }

  ShowSupervisor(){
    this.showClientes = false;
    this.showEmpleados = false;
    this.showSupervisor = true
  }

}
