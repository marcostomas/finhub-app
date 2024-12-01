import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContasUsuario } from './interfaces/dados-contas';
import { SaldoTotalHome } from './interfaces/saldo-total';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getSaldoConta(cpf: string): Observable<SaldoTotalHome> {
    return this.http.get<SaldoTotalHome>(
      `https://localhost:7152/api/Extrato/SaldoConta?cpf=${cpf}`
    );
  }

  getDadosContas(cpf: string): Observable<ContasUsuario> {
    return this.http.get<ContasUsuario>(
      `https://localhost:7152/api/Extrato/ExtratoConta?cpf=${cpf}`
    );
  }
}
