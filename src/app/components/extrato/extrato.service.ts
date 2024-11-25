import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosEntrada } from './entrada';
import { DadosSaida } from './saida';

@Injectable({
  providedIn: 'root',
})
export class ExtratoService {
  private apiUrlEntrada = 'URL_DA_API_ENTRADA';
  private apiUrlSaida = 'URL_DA_API_SAIDA';

  constructor(private http: HttpClient) {}

  getDadosEntrada(): Observable<DadosEntrada> {
    return this.http.get<DadosEntrada>(this.apiUrlEntrada);
  }

  getDadosSaida(): Observable<DadosSaida> {
    return this.http.get<DadosSaida>(this.apiUrlSaida);
  }
}
