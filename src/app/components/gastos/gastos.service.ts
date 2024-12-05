import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaldoTotalHome } from '../home/interfaces/saldo-total';


// Interfaces para os dados retornados pela API
export interface GastosPorClassificacao {
  classificacao: string;
  valor: number;
}

export interface GastosPorConta {
  numeroConta: string;
  valor: number;
}

export class GastosPorClassificacao implements GastosPorClassificacao{
  constructor(
    public classificacao: string,
    public valor: number    
  ) {}
}

export class GastosPorConta implements GastosPorConta{
  constructor(
    public numeroConta: string,
    public valor: number
  ){}
}

@Injectable({
  providedIn: 'root', // Disponível globalmente
})
export class GastosService {
  private apiBaseUrl = 'https://localhost:7152/api/CentralGastos'; // Base da API

  constructor(private http: HttpClient) {}

  // getSaldoConta(cpf: string): Observable<SaldoTotalHome> {
  //   return this.http.get<SaldoTotalHome>(
  //     `https://localhost:7152/api/Extrato/SaldoConta?cpf=${cpf}`
  //   );
  // }

  GetGastosPorClassificacao(clienteCPF: string, dataInicio: string, dataFim: string): Observable<{ [key: string]: number }> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorClassificacao`;
    const body = { clienteCPF, dataInicio, dataFim };
    return this.http.post<{ [key: string]: number }>(endpoint, body);
  }


  // Método para buscar gastos por classificação via POST
  // getGastosPorClassificacao(
  //   clienteCPF: string,
  //   classificacao: number,
  //   dataInicio: string,
  //   dataFim: string
  // ): Observable<GastosPorClassificacao[]> {
  //   const endpoint = `${this.apiBaseUrl}/GetGastosPorClassificacao`;
  //   const body = {
  //     clienteCPF,
  //     classificacao, // Enviando a classificação no corpo
  //     dataInicio,
  //     dataFim,
  //   };
  //   return this.http.post<GastosPorClassificacao[]>(endpoint, body);
  // }

  // Método para buscar gastos por conta via POST
  getGastosPorConta(
    clienteCPF: string,
    conta: string,
    dataInicio: string,
    dataFim: string
  ): Observable<GastosPorConta> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorConta`;
    const body = { clienteCPF, conta, dataInicio, dataFim };
  
    // Solicita a resposta como texto
    return this.http.post(endpoint, body, { responseType: 'text' }).pipe(
      map((response: string) => {
        // Trata a resposta no formato "12345678: 0,00"
        const [numeroConta, valorString] = response.split(':');
        const valor = parseFloat(valorString.replace(',', '.').trim());
        return { numeroConta: numeroConta.trim(), valor }; // Retorna no formato esperado
      })
    );
  }
  
}
