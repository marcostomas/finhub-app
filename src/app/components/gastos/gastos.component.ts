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
import { Chart, ArcElement, ChartData, ChartOptions, registerables, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PieController, BarController } from 'chart.js';

// Registrar todos os componentes necessários, incluindo o PieController para o gráfico de pizza
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController, PieController);


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
  jsonData: { nomeconta: string; bars:{ label: string; value: number }[]}[] = [];
  
  barCharts: Chart[] = []; // Instâncias dos gráficos de barras
  pieChartInstance: Chart | null = null; // Instância do gráfico de pizza
  colors = ['#56a870', '#007ba0', '#f76507', '#141315', '#089af8', '#a9518f', '#ffca0e', '#00f6ff', '#ebecea'];
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
    
    // Convertendo as datas para objetos Date
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
  
    // Verificando se o intervalo de datas é válido
    if (inicio > fim) {
      this.mensagemErro = 'A data de início não pode ser maior que a data de fim.';
      return;
    }
  
    // Carregar os dados para o gráfico de pizza com base na classificação
    this.gastosService.GetGastosPorClassificacao(clienteCPF, dataInicio, dataFim).subscribe({
      next: (data) => {
        // Transformando os dados para a estrutura esperada pelo gráfico de pizza
        this.pieChartData = Object.keys(data).map((classificacao, index) => ({
          label: classificacao,
          value: Math.abs(data[classificacao]),
          pieflavor: this.getDynamicColor(index) // Cor dinâmica para cada classificação
        }));
        
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
      // Limpa os dados de barras caso tenha uma conta selecionada
      this.jsonData = []; 
  
      // Busca os dados para a conta selecionada
      let currentDate = new Date(inicio);
      while (currentDate <= fim) {
        const startMonth = this.formatDate(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        const endMonth = this.formatDate(currentDate);
  
        // Fazendo a requisição para cada mês
        this.gastosService.getGastosPorConta(clienteCPF, conta, startMonth, endMonth).subscribe({
          next: (data) => {
            // Adiciona os dados à jsonData para o gráfico de barras
            const accountIndex = this.jsonData.findIndex((account) => account.nomeconta === conta);
            
            if (accountIndex === -1) {
              // Se a conta ainda não existir, cria um novo item em jsonData
              this.jsonData.push({
                nomeconta: conta,
                bars: [{
                  label: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
                  value: Math.abs(data.valor) // Garantindo que o valor seja positivo
                }]
              });
            } else {
              // Se a conta já existir, adiciona os dados de barra
              this.jsonData[accountIndex].bars.push({
                label: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
                value: Math.abs(data.valor)
              });
            }
            
            // Atualiza o gráfico de barras após adicionar os dados
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
      // Se não houver conta específica, carrega os dados para todas as contas
      this.jsonData = [];
      let currentDate = new Date(inicio);
      while (currentDate <= fim) 
      {this.contas.forEach((conta) => {
        let currentDate = new Date(inicio);
        while (currentDate <= fim) {
          const startMonth = this.formatDate(currentDate);
          currentDate.setMonth(currentDate.getMonth() + 1);
          const endMonth = this.formatDate(currentDate);
  
          this.gastosService.getGastosPorConta(clienteCPF, conta.numero, startMonth, endMonth).subscribe({
            next: (data) => {
              const accountIndex = this.jsonData.findIndex((account) => account.nomeconta === conta.nome);
  
              if (accountIndex === -1) {
                this.jsonData.push({
                  nomeconta: conta.nome,
                  bars: [{
                    label: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
                    value: Math.abs(data.valor) // Garantindo que o valor seja positivo
                  }]
                });
              } else {
                this.jsonData[accountIndex].bars.push({
                  label: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`,
                  value: Math.abs(data.valor)
                });
              }
  
              console.log(this.jsonData); // Log para debugar
  
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
      });}
    }
  }
  
  // initializeChartData() {
  //   // Ajusta valores e cores dinâmicas
  //   this.pieChartData = this.jsonData.map((data, index) => ({
  //     ...data,
  //     value: Math.abs(data.value), // Torna o valor positivo
  //     pieflavor: this.getDynamicColor(index),
  //   }));
  //   console.log(this.pieChartData);
  // }

  private getDynamicColor(index: number): string {
    //const colors = ['#56a870', '#007ba0', '#f76507', '#141315', '#089af8', '#a9518f', '#ffca0e', '#00f6ff', '#ebecea'];
    return this.colors[index % this.colors.length]; // Garante que não ultrapasse o limite do array
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
    // Verifica e destrói qualquer gráfico de barras anterior antes de criar um novo
    if (this.barCharts.length > 0) {
      this.barCharts.forEach((chart) => chart.destroy());
      this.barCharts = []; // Reseta a lista de gráficos de barras
    }
  
    // Agora criamos os novos gráficos de barras com os dados em jsonData
    this.jsonData.forEach((data, index) => {
      const ctx = this.barCanvasRefs.toArray()[index]?.nativeElement.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.bars.map((bar) => bar.label), // Mês-ano
            datasets: [
              {
                label: data.nomeconta,
                data: data.bars.map((bar) => bar.value), // Valores de cada mês
                backgroundColor: this.getDynamicColor(index), // Cor dinâmica para cada conjunto de barras
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
        this.barCharts.push(chart); // Adiciona o gráfico à lista de gráficos
      }
    });
  }
    
  
}
