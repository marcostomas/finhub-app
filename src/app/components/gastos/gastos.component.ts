//import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NgFor } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Registrar os componentes necessários do Chart.js
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [NgFor], // Apenas os módulos necessários para o componente
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('barChart') barCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;

  private pieChart: Chart | undefined;
  private barCharts: Chart[] = [];

  pieChartData: { label: string; value: number; pieflavor: string }[] = [];
  //jsonData: { label: string; value: number }[] = [];
  jsonData  = [{ label: 'string', value: 200 },
              { label: 'string', value: 300 },
              { label: 'string', value: 100 },
              { label: 'string', value: 150 },
              { label: 'string', value: 120 },
              { label: 'string', value: 180 }
  ];

  colorpalet = [
    'rgba(56, 97, 80, 1.0)',  // Alimentos
    'rgba(0, 105, 146, 1.0)', // Transporte
    'rgba(247, 101, 7, 1.0)', // Moradia
    'rgba(20, 17, 21, 1.0)'   // Lazer
  ];

  //constructor(private http: HttpClient) {} // HttpClient já está disponível

  ngOnInit() {
    //this.fetchDataFromApi();
    this.initializeChartData();
  }

  ngAfterViewInit() {
    // Agora, cria os gráficos após a visualização e os dados estarem prontos
    //this.createPieChart();
        // Registra todos os componentes do Chart.js
        Chart.register(...registerables);

        // Gráfico de Pizza (Setores)
        const pieCtx = this.pieCanvasRef.nativeElement.getContext('2d');
        if (pieCtx) {
          this.pieChart = new Chart(pieCtx, {
            type: 'pie', // Tipo de gráfico 'pie'
            data: {
              labels: this.pieChartData.map(d => d.label),
              datasets: [{
                data: this.pieChartData.map(d => d.value),
                backgroundColor: this.pieChartData.map(d => d.pieflavor)
              }]
            } as ChartData,
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
              }
            } as ChartOptions
          });
        }
    

    this.createBarCharts();
  }

  // fetchDataFromApi() {
  //   const apiUrl = 'URL_DA_API'; // Substitua pelo endpoint da API
  //   this.http.get<{ label: string, value: number }[]>(apiUrl).subscribe({
  //      next: (data) => {
  //        this.jsonData = data;
  //     //   this.initializeChartData();
  //     //   this.createPieChart();
  //     //   this.createBarCharts();
  //      },
  //     error: (err) => {
  //       console.error('Erro ao obter dados da API:', err);
  //     }
  //   });
  // }

  private initializeChartData() {
    const baseColor = { r: 255, g: 250, b: 240, a: 1.0 };

    const generateColor = (base: { r: number; g: number; b: number; a: number }, subtract: string): string => {
      const match = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d(\.\d+)?)\)/.exec(subtract);
      if (!match) throw new Error(`Formato inválido de cor: ${subtract}`);

      const subtractRGB = {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: parseFloat(match[4])
      };

      const newRGB = {
        r: Math.max(0, base.r - subtractRGB.r),
        g: Math.max(0, base.g - subtractRGB.g),
        b: Math.max(0, base.b - subtractRGB.b),
        a: base.a
      };

      return `rgba(${newRGB.r}, ${newRGB.g}, ${newRGB.b}, ${newRGB.a})`;
    };

    while (this.colorpalet.length < this.jsonData.length) {
      const index = this.colorpalet.length % 4;
      const newColor = generateColor(baseColor, this.colorpalet[index]);
      this.colorpalet.push(newColor);
    }

    this.pieChartData = this.jsonData.map((data, index) => {
      const pieflavor = this.colorpalet[index];
      return { ...data, pieflavor };
    });

    this.pieChartData = [...this.pieChartData];
  }

  createPieChart() {
    const pieCtx = this.pieCanvasRef.nativeElement.getContext('2d');
    if (pieCtx) {
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: this.pieChartData.map(d => d.label),
          datasets: [{
            data: this.pieChartData.map(d => d.value),
            backgroundColor: this.pieChartData.map(d => d.pieflavor)
          }]
        } as ChartData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: { enabled: true }
          } 
        }as ChartOptions
      });
    }
  }

  createBarCharts() {
    this.barCanvasRefs.toArray().forEach((canvasRef, index) => {
      const ctx = canvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.jsonData.map(d => d.label),
            datasets: [{
              label: this.pieChartData[index]?.label || 'Categoria',
              data: this.jsonData.map(d => d.value),
              backgroundColor: this.pieChartData[index]?.pieflavor || 'rgba(200, 200, 200, 0.7)'
            }]
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
              legend: { position: 'top' },
              tooltip: { enabled: true }
            }
          }
        });

        this.barCharts.push(barChart);
      }
    });
  }
}
