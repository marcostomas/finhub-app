import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-gastos',
  standalone: true,
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements AfterViewInit {
  @ViewChild('gastosChart') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | undefined;

  ngAfterViewInit() {
    // Registra todos os componentes do Chart.js
    Chart.register(...registerables);

    // Obtém o contexto do canvas diretamente a partir da referência
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (ctx) {
      // Criação do gráfico
      this.chart = new Chart(ctx, {
        type: 'bar',  // Tipo de gráfico (bar, line, pie, etc.)
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'], // Labels (eixo X)
          datasets: [{
            label: 'Gastos Mensais',
            data: [200, 400, 300, 500, 450], // Dados (eixo Y)
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Cor de fundo das barras
            borderColor: 'rgba(54, 162, 235, 1)', // Cor da borda das barras
            borderWidth: 1
          }]
        },
        options: {
          responsive: true, // O gráfico se ajusta automaticamente
          scales: {
            y: {
              beginAtZero: true // Iniciar o eixo Y do gráfico em 0
            }
          }
        }
      });
    } else {
      console.error('Falha ao obter o contexto do canvas.');
    }
  }
}
