import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
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

    // Método para buscar gastos por classificação
    getGastosPorClassificacaoGET(clienteCPF: string, dataInicio: string, dataFim: string): Observable<GastosPorClassificacao[]> {
      const params = new HttpParams()
        .set('clienteCPF', clienteCPF)
        .set('dataInicio', dataInicio)
        .set('dataFim', dataFim);
      const endpoint = `${this.apiBaseUrl}/GetGastosPorClassificacao`;
      return this.http.get<GastosPorClassificacao[]>(endpoint, { params });
    }
  
    // Método para buscar gastos por conta
    getGastosPorContaGET(clienteCPF: string, conta: string, dataInicio: string, dataFim: string): Observable<GastosPorConta[]> {
      const params = new HttpParams()
        .set('clienteCPF', clienteCPF)
        .set('conta', conta)
        .set('dataInicio', dataInicio)
        .set('dataFim', dataFim);
      const endpoint = `${this.apiBaseUrl}/GetGastosPorConta`;
      return this.http.get<GastosPorConta[]>(endpoint, { params });
    }
  
}


// export class GastosService {
//   private apiUrl = 'https://localhost:7152/api/CentralGastos/GetGastosPorClassificacao'; // Endpoint da sua API

//   constructor(private http: HttpClient) {}

//   // Método GET que recebe filtros e constrói os parâmetros da URL
//   getGastos(filtros: any): Observable<any> {
//     // Construindo os parâmetros de consulta (query params) para a URL
//     let params = new HttpParams()
//       .set('clienteCPF', filtros.clienteCPF)
//       .set('dataInicio', filtros.dataInicio)
//       .set('dataFim', filtros.dataFim)
//       .set('conta', filtros.conta);

//     // Fazendo a requisição GET com os parâmetros
//     return this.http.get<any>(this.apiUrl, { params });
//   }
// }
