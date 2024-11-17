import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-gastos',
  standalone: true,
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements AfterViewInit {
  @ViewChild('pieChart') pieCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barCanvasRef!: ElementRef<HTMLCanvasElement>;

  private pieChart: Chart | undefined;
  private barChart: Chart | undefined;

  ngAfterViewInit() {
    // Registra todos os componentes do Chart.js
    Chart.register(...registerables);

    // Gráfico de Pizza (Setores)
    const pieCtx = this.pieCanvasRef.nativeElement.getContext('2d');
    if (pieCtx) {
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',  // Tipo de gráfico 'pie'
        data: {
          labels: ['Alimentos', 'Transporte', 'Moradia', 'Lazer', 'Outros'],
          datasets: [{
            data: [300, 150, 450, 100, 75],
            backgroundColor: [
              'rgba(56, 97, 80, 1.0)',
              'rgba(20, 17, 21, 1.0)',
              'rgba(0, 105, 146, 1.0)',
              'rgba(247, 101, 7, 1.0)',
              'rgba(0, 105, 146, 0.5)'
            ],
            borderWidth: 0
          }]
        } as ChartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              enabled: true,
            }
          }
        } as ChartOptions
      });
    }

    // Gráfico de Barras
    const barCtx = this.barCanvasRef.nativeElement.getContext('2d');
    if (barCtx) {
      this.barChart = new Chart(barCtx, {
        type: 'bar',  // Tipo de gráfico 'bar'
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho','Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          datasets: [{
            label: 'Alimentos',
            data: [200, 400, 300, 500, 450, 250,300,200,200,150,300,0],
            backgroundColor: 'rgba(56, 97, 80, 1.0)'
          }]
        } as ChartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              enabled: true,
            }
          }
        } as ChartOptions
      });
    }
  }
}
