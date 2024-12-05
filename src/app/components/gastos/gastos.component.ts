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
  jsonData: { label: string; value: number }[] = [];
  
  barCharts: Chart[] = []; // Instâncias dos gráficos de barras
  pieChartInstance: Chart | null = null; // Instância do gráfico de pizza

  // Lista de contas para consulta
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
  
    // Carregar os dados para o gráfico de pizza com base na classificação
    this.gastosService.GetGastosPorClassificacao(clienteCPF, dataInicio, dataFim).subscribe({
      next: (data) => {
        // Transformando os dados para a estrutura esperada pelo gráfico de pizza
        this.pieChartData = Object.keys(data).map((classificacao, index) => ({
          label: classificacao,
          value: data[classificacao],
          pieflavor: this.getDynamicColor(index)// Cor dinâmica para cada classificação
        }));
        this.initializeChartData();
        // Log para debugar os dados do gráfico de pizza
        console.log(this.pieChartData);
        
        // Inicializa o gráfico de pizza (caso já tenha dados)
        if (this.pieChartData.length > 0) {
          this.createPieChart();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados por classificação:', err);
        this.mensagemErro = 'Erro ao carregar dados por classificação';
      }
    });
  
    // Verifica se há uma conta específica para filtrar os dados do gráfico de barras
    if (conta) {
      // Busca apenas os dados da conta selecionada
      this.gastosService.getGastosPorConta(clienteCPF, conta, dataInicio, dataFim).subscribe({
        next: (data) => {
          this.jsonData = [
            {
              label: data.numeroConta,
              value: data.valor,
            },
          ];
          this.initializeChartData(); // Atualiza os dados para o gráfico de barras
        },
        error: (err) => {
          console.error('Erro ao carregar dados por conta:', err);
          this.mensagemErro = 'Erro ao carregar dados por conta';
        },
      });
    } else {
      // Se não houver conta, busca os dados para todas as contas
      this.jsonData = [];
      this.contas.forEach((conta) => {
        this.gastosService
          .getGastosPorConta(clienteCPF, conta.numero, dataInicio, dataFim)
          .subscribe({
            next: (data) => {
              console.log(`Dados processados para a conta ${conta.nome}:`, data);
              this.jsonData.push({
                label: conta.nome,
                value: Math.abs(data.valor),
              });
              this.jsonData = [...this.jsonData]; // Atualiza a lista de dados para o gráfico de barras
              this.initializeChartData(); // Atualiza os dados para o gráfico de barras
            },
            error: (err) => {
              console.error(`Erro ao carregar dados da conta ${conta.nome}:`, err);
              this.mensagemErro = `Erro ao carregar dados da conta ${conta.nome}`;
            },
          });
      });
    }
  }
  
  initializeChartData() {
    // Ajusta valores e cores dinâmicas
    this.pieChartData = this.jsonData.map((data, index) => ({
      ...data,
      value: Math.abs(data.value), // Torna o valor positivo
      pieflavor: this.getDynamicColor(index),
    }));
    console.log(this.pieChartData);
  }

  private getDynamicColor(index: number): string {
    const colors = ['#56a870', '#007ba0', '#f76507', '#141315', '#089af8', '#a9518f', '#ffca0e', '#00f6ff', '#ebecea'];
    return colors[index % colors.length]; // Garante que não ultrapasse o limite do array
  }

  ngAfterViewInit(): void {
    console.log(this.pieChartData.length);
    if (this.pieChartData.length > 0) {
      console.log(this.pieChartData);
      this.createPieChart();
    }
    
    console.log(this.jsonData.length);
    if (this.jsonData.length > 0) {
      console.log(this.jsonData);
      this.createBarCharts();
    }
  }

  createPieChart() {
    const ctx = this.pieCanvasRef.nativeElement.getContext('2d');
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy(); // Destroi o gráfico existente
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
        }as ChartData,
      });
    }
  }

  createBarCharts() {
    this.barCharts.forEach((chart) => chart.destroy()); // Destroi gráficos de barras existentes
    this.barCharts = []; // Reseta a lista de gráficos

    this.barCanvasRefs.toArray().forEach((canvasRef, index) => {
      const ctx = canvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.jsonData.map((d) => d.label),
            datasets: [
              {
                label: this.jsonData[index]?.label || 'Categoria',
                data: [this.jsonData[index]?.value || 0],
                backgroundColor: this.pieChartData[index]?.pieflavor || '#cccccc',
              },
            ],
          } as ChartData,
          options: {
            scales: {
              y: {
                beginAtZero: false,
              },
            },
          } as ChartOptions,
        });
        this.barCharts.push(chart);
      }
    });
  }
}
