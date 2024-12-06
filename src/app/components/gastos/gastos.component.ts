import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GastosService } from './gastos.service';
import { Chart, ArcElement, ChartData, ChartOptions, registerables, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PieController } from 'chart.js';

// Registrar todos os componentes necessários, incluindo o PieController para o gráfico de pizza
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PieController);


@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  providers: [],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css'],
})

export class GastosComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('barChart') barCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;

  filtros = {
    clienteCPF: '47526501933',
    conta: '',
    dataInicio: '',
    dataFim: '',
  };

  mensagemErro: string = '';
  pieChartData: { label: string; value: number; pieflavor: string }[] = [];
  jsonData: { nomeconta: string; bars: { label: string; value: number }[] }[] = [];

  barCharts: Chart[] = []; // Instâncias dos gráficos de barras
  pieChartInstance: Chart | null = null; // Instância do gráfico de pizza
  colors = ['#56a870', '#007ba0', '#f76507', '#141315', '#089af8', '#a9518f', '#ffca0e', '#00f6ff', '#ebecea'];

  contas = [
    { numero: '12345678', nome: 'Bradesco' },
    { numero: '56482100', nome: 'Banco PAN' },
    { numero: '45469208', nome: 'Banco Safra' },
    { numero: '89461379', nome: 'BTG Pactual' },
  ];

  constructor(private gastosService: GastosService) {}

  ngOnInit(): void {
    this.setDataInicialEFim();
    this.carregarDados();
  }

  setDataInicialEFim() {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    this.filtros.dataInicio = this.formatDate(inicioMes);
    this.filtros.dataFim = this.formatDate(hoje);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  carregarDados() {
    const { clienteCPF, dataInicio, dataFim, conta } = this.filtros;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (inicio > fim) {
      this.mensagemErro = 'A data de início não pode ser maior que a data de fim.';
      return;
    }

    this.gastosService.GetGastosPorClassificacao(clienteCPF, dataInicio, dataFim).subscribe({
      next: (data) => {
        this.pieChartData = Object.keys(data).map((classificacao, index) => ({
          label: classificacao,
          value: Math.abs(data[classificacao]),
          pieflavor: this.getDynamicColor(index),
        }));

        if (this.pieChartData.length > 0) {
          this.createPieChart();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados por classificação:', err);
        this.mensagemErro = 'Erro ao carregar dados por classificação';
      }
    });

    if (conta) {
      let currentDate = new Date(inicio);
      while (currentDate <= fim) {
        const startMonth = this.formatDate(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        const endMonth = this.formatDate(currentDate);

        this.gastosService.getGastosPorConta(clienteCPF, conta, startMonth, endMonth).subscribe({
          next: (data) => {
            this.jsonData.push({
              nomeconta: conta,
              bars: [
                {
                  label: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
                  value: Math.abs(data.valor),
                },
              ],
            });

            this.jsonData = [...this.jsonData];
            if (this.jsonData.length > 0) {
              this.createBarCharts();
            }
          },
          error: (err) => {
            console.error('Erro ao carregar dados da conta:', err);
            this.mensagemErro = 'Erro ao carregar dados da conta';
          }
        });
      }
    } else {
      this.jsonData = [];
      this.contas.forEach((conta) => {
        let currentDate = new Date(inicio);
        while (currentDate <= fim) {
          const startMonth = this.formatDate(currentDate);
          currentDate.setMonth(currentDate.getMonth() + 1);
          const endMonth = this.formatDate(currentDate);

          this.gastosService.getGastosPorConta(clienteCPF, conta.numero, startMonth, endMonth).subscribe({
            next: (data) => {
              this.jsonData.push({
                nomeconta: conta.numero,
                bars: [
                  {
                    label: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
                    value: Math.abs(data.valor),
                  },
                ],
              });

              this.jsonData = [...this.jsonData];
              if (this.jsonData.length > 0) {
                this.createBarCharts();
              }
            },
            error: (err) => {
              console.error('Erro ao carregar dados da conta:', err);
              this.mensagemErro = 'Erro ao carregar dados da conta';
            }
          });
        }
      });
    }
  }

  createPieChart() {
    const ctx = this.pieCanvasRef.nativeElement.getContext('2d');
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }

    if (ctx) {
      this.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.pieChartData.map((d) => d.label),
          datasets: [
            {
              data: this.pieChartData.map((d) => d.value),
              backgroundColor: this.pieChartData.map((d) => d.pieflavor),
            },
          ],
        } as ChartData,
      });
    }
  }

  createBarCharts() {
    this.barCharts.forEach((chart) => chart.destroy());
    this.barCharts = [];

    this.jsonData.forEach((data, index) => {
      const labels = data.bars.map((d) => d.label);
      const values = data.bars.map((d) => d.value);

      const ctx = this.barCanvasRefs.toArray()[index].nativeElement.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Gastos Mensais',
                data: values,
                backgroundColor: this.getDynamicColor(index),
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: false,
              },
            },
          },
        });

        this.barCharts.push(chart);
      }
    });
  }

  private getDynamicColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  ngAfterViewInit(): void {
    if (this.pieChartData.length > 0) {
      this.createPieChart();
    }

    if (this.jsonData.length > 0) {
      this.createBarCharts();
    }
  }
}
