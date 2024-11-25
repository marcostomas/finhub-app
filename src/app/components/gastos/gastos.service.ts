import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GastosPorClassificacao {
  classificacao: string;
  valor: number;
}

interface GastosPorConta {
  numeroConta: string;
  valor: number;
}

@Injectable({
  providedIn: 'root', // Disponível globalmente
})
export class GastosService {
  private apiBaseUrl = 'https://localhost:7152/api/CentralGastos'; // Base da API

  constructor(private http: HttpClient) {}

  getGastosPorClassificacao(clienteCPF: string, dataInicio: string, dataFim: string): Observable<GastosPorClassificacao[]> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorClassificacao`;
    const body = { clienteCPF, classificacao: 0, dataInicio, dataFim };
    return this.http.post<GastosPorClassificacao[]>(endpoint, body);
  }

  getGastosPorConta(clienteCPF: string, conta: string, dataInicio: string, dataFim: string): Observable<GastosPorConta[]> {
    const endpoint = `${this.apiBaseUrl}/GetGastosPorConta`;
    const body = { clienteCPF, conta, dataInicio, dataFim };
    return this.http.post<GastosPorConta[]>(endpoint, body);
  }
}
