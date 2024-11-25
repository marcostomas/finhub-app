import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { GastosService } from './gastos.service'; // Importação do serviço
import { Chart } from 'chart.js';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [NgFor, FormsModule],
  providers: [], // Removemos o provideHttpClient daqui, pois foi configurado globalmente
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('barChart') barCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;

  filtros = {
    clienteCPF: '12345678901', // Exemplo de CPF fixo
    conta: '',
    dataInicio: '',
    dataFim: ''
  };

  pieChartData: { label: string; value: number; pieflavor: string }[] = [];
  jsonData: { label: string; value: number }[] = [];
  barCharts: Chart[] = [];

  constructor(private gastosService: GastosService) {}

  ngOnInit(): void {
    // Carregar os dados iniciais com filtros padrão
    this.carregarDados();
  }

  carregarDados() {
    var { clienteCPF, dataInicio, dataFim, conta } = this.filtros;
    clienteCPF= '47526501933';
    // Decide qual método do serviço usar, dependendo dos filtros aplicados
    if (conta) {
      this.gastosService.getGastosPorConta(clienteCPF, conta, dataInicio, dataFim).subscribe({
        next: (data) => {
          this.jsonData = data.map(item => ({
            label: item.numeroConta,
            value: item.valor
          }));
          this.initializeChartData();
        },
        error: (err) => console.error('Erro ao carregar dados:', err)
      });
    } else {
      this.gastosService.getGastosPorClassificacao(clienteCPF, dataInicio, dataFim).subscribe({
        next: (data) => {
          this.jsonData = data.map(item => ({
            label: item.classificacao,
            value: item.valor
          }));
          this.initializeChartData();
        },
        error: (err) => console.error('Erro ao carregar dados:', err)
      });
    }
  }
  
  initializeChartData() {
    this.pieChartData = this.jsonData.map((data, index) => ({
      ...data,
      pieflavor: this.getDynamicColor(index)
    }));

    //this.createPieChart();
    //this.createBarCharts();
  }

  private getDynamicColor(index: number): string {
    const colors = ['#56a870', '#007ba0', '#f76507', '#141315'];
    return colors[index % colors.length];
  }

  ngAfterViewInit(): void {
      this.createPieChart;
      this.createBarCharts;
  }
  createPieChart() {
    const ctx = this.pieCanvasRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.pieChartData.map(d => d.label),
          datasets: [{
            data: this.pieChartData.map(d => d.value),
            backgroundColor: this.pieChartData.map(d => d.pieflavor)
          }]
        }
      });
    }
  }

  createBarCharts() {
    this.barCanvasRefs.toArray().forEach((canvasRef, index) => {
      const ctx = canvasRef.nativeElement.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.jsonData.map(d => d.label),
            datasets: [{
              label: this.pieChartData[index]?.label || 'Categoria',
              data: this.jsonData.map(d => d.value),
              backgroundColor: this.pieChartData[index]?.pieflavor
            }]
          }
        });
      }
    });
  }
}
