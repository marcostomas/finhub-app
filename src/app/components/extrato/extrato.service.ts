import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosEntrada } from './entrada';
import { DadosSaida } from './saida';
import { SaldoTotalHome } from '../home/interfaces/saldo-total';

@Injectable({
  providedIn: 'root',
})
export class ExtratoService {
  constructor(private http: HttpClient) {}

  getSaldoConta(cpf: string): Observable<SaldoTotalHome> {
    return this.http.get<SaldoTotalHome>(
      `https://localhost:7152/api/Extrato/SaldoConta?cpf=${cpf}`
    );
  }

  getDadosEntrada(cpf: string): Observable<DadosEntrada> {
    return this.http.get<DadosEntrada>(
      `https://localhost:7152/api/Extrato/EntradasConta?cpf=${cpf}`
    );
  }

  getDadosSaida(cpf: string): Observable<DadosSaida> {
    return this.http.get<DadosSaida>(
      `https://localhost:7152/api/Extrato/SaidasConta?cpf=${cpf}`
    );
  }
}
