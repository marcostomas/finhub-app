import { NgFor } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements AfterViewInit {
  @ViewChild('pieChart') pieCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('barChart') barCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;

  private pieChart: Chart | undefined;
  private barCharts: Chart[] = [];

  // Exemplo de dados (em um cenário real, esses dados seriam dinâmicos)
  pieChartData = [
    { label: 'Alimentos', value: 0, pieflavor: 'rgba(56, 97, 80, 1.0)' },
    { label: 'Transporte', value: 0, pieflavor:'rgba(0, 105, 146, 1.0)'},
    { label: 'Moradia', value: 0, pieflavor:'rgba(0, 105, 146, 1.0)' },
    { label: 'Lazer', value: 0, pieflavor:'rgba(0, 105, 146, 1.0)' },
    { label: 'Outros', value: 0, pieflavor:'rgba(0, 105, 146, 1.0)' }
  ];

  barChartData = [
    { label: 'Janeiro', values: [200, 150, 250, 100, 50] },
    { label: 'Fevereiro', values: [250, 100, 350, 120, 90] },
    { label: 'Março', values: [300, 200, 400, 130, 110] },
    { label: 'Abril', values: [400, 250, 500, 150, 130] },
    { label: 'Maio', values: [450, 300, 550, 170, 150] },
    { label: 'Junho', values: [450, 300, 550, 170, 150] },
    { label: 'Julho', values: [450, 300, 550, 170, 150] },
    { label: 'Agosto', values: [450, 300, 550, 170, 150] },
    { label: 'Setembro', values: [450, 300, 550, 170, 150] },
    { label: 'Outubro', values: [450, 300, 550, 170, 150] },
    { label: 'Novembro', values: [450, 300, 550, 170, 150] },
    { label: 'Dezembro', values: [0, 0, 0, 0, 0] }
  ];

  colorpalet = [
    'rgba(56, 97, 80, 1.0)',
    'rgba(0, 105, 146, 1.0)',
    'rgba(247, 101, 7, 1.0)',
    'rgba(20, 17, 21, 1.0)'
  ];
  
  private defineData() {
    // Loop through pieChartData categories
    for (let i = 0; i < this.pieChartData.length; i++) {
      // Sum the values for the current category across all months
      this.pieChartData[i].value = this.barChartData.reduce((sum, element) => sum + element.values[i], 0);
      
      // Ensure that we have enough colors in the color palette
      if (i >= this.colorpalet.length) {
        const newColor = this.adjustColorOpacity(this.colorpalet[i % 4], 0.5); // Adjust the opacity for new colors
        this.colorpalet.push(newColor);
      }
      
      // Assign the color to the pieChartData category
      this.pieChartData[i].pieflavor = this.colorpalet[i];
    }
  
    // Ensure Angular tracks the changes by creating new references
    this.pieChartData = [...this.pieChartData];  // This triggers change detection for pieChartData
    this.colorpalet = [...this.colorpalet];      // This triggers change detection for colorpalet
  
    return this.pieChartData;
  }
  
  // Helper function to adjust color opacity
  private adjustColorOpacity(color: string, opacityFactor: number): string {
    let temp = color.split(',');
    let opacity = parseFloat(temp[3].replace(')', '').trim());
    let newOpacity = Math.max(0, Math.min(1, opacity * opacityFactor)); // Make sure opacity is between 0 and 1
    temp[3] = `, ${newOpacity})`; // Update opacity value
    return temp.join(',');
  }
  

  ngAfterViewInit() {
    // Registra todos os componentes do Chart.js
    Chart.register(...registerables);
    this.pieChartData = this.defineData();
    // Gráfico de Pizza (Setores)
    const pieCtx = this.pieCanvasRef.nativeElement.getContext('2d');
    if (pieCtx) {
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',  // Tipo de gráfico 'pie'
        data: {
          labels: this.pieChartData.map(d => d.label),
          datasets: [{
            data: this.pieChartData.map(d => d.value),
             backgroundColor: this.pieChartData.map(d => d.pieflavor) //[
            //   'rgba(56, 97, 80, 1.0)',
            //   'rgba(0, 105, 146, 1.0)',
            //   'rgba(247, 101, 7, 1.0)',
            //   'rgba(0, 105, 146, 0.5)',
            //   'rgba(20, 17, 21, 1.0)'
            // ]
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

    // Gráficos de Barras Dinâmicos (baseado no número de categorias do gráfico de pizza)
    this.createBarCharts();
  }

  // Cria os gráficos de barras dinamicamente com base nos dados do gráfico de pizza
  createBarCharts() {
    this.barCanvasRefs.toArray().forEach((canvasRef, index) => {
      const ctx = canvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const barChart = new Chart(ctx, {
          type: 'bar',  // Tipo de gráfico 'bar'
          data: {
            labels: this.barChartData.map(d => d.label),  // Labels no eixo X
            datasets: [{
              label: this.pieChartData[index]?.label || 'Categoria',  // Rótulo da barra
              data: this.barChartData.map(d => d.values[index]),  // Dados para a categoria correspondente
              backgroundColor: this.pieChartData[index]?.pieflavor
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

        this.barCharts.push(barChart); // Armazena as instâncias dos gráficos
      }
    });
  }
}