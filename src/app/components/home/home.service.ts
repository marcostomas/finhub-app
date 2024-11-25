import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContasUsuario } from './home-interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = 'URL_DA_API_HOME';

  constructor(private http: HttpClient) {}

  getDados(): Observable<ContasUsuario> {
    return this.http.get<ContasUsuario>(this.apiUrl);
  }
}
