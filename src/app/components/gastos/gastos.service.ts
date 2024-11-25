import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para os dados retornados pela API
export interface GastosPorClassificacao {
  classificacao: string;
  valor: number;
}

export interface GastosPorConta {
  numeroConta: string;
  valor: number;
}

@Injectable({
  providedIn: 'root', // Disponível globalmente
})
export class GastosService {
  private apiBaseUrl = 'https://localhost:7152/api/CentralGastos'; // Base da API

  constructor(private http: HttpClient) {}

  // Método para buscar gastos por classificação via POST
  getGastosPorClassificacao(
    clienteCPF: string,
    classificacao: number,
    dataInicio: string,
    dataFim: string
  ): Observable<GastosPorClassificacao[]> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorClassificacao`;
    const body = {
      clienteCPF,
      classificacao, // Enviando a classificação no corpo
      dataInicio,
      dataFim,
    };
    return this.http.post<GastosPorClassificacao[]>(endpoint, body);
  }

  NEWGetGastosPorClassificacao(clienteCPF: string, dataInicio: string, dataFim: string): Observable<{ [key: string]: number }> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorClassificacao`;
    const body = { clienteCPF, dataInicio, dataFim };
    return this.http.post<{ [key: string]: number }>(endpoint, body);
  }




  // Método para buscar gastos por conta via POST
  getGastosPorConta(
    clienteCPF: string,
    conta: string,
    dataInicio: string,
    dataFim: string
  ): Observable<GastosPorConta[]> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorConta`;
    const body = {
      clienteCPF,
      conta, // Conta enviada no corpo da requisição
      dataInicio,
      dataFim,
    };
    return this.http.post<GastosPorConta[]>(endpoint, body);
  }
}
