import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';
import { ContasUsuario } from './interfaces/dados-contas';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public saldoTotal: any = { saldo: 0 };
  public dadosUsuario: any = [];
  constructor(private service: HomeService) {}

  ngOnInit() {
    this.getSaldoTotal('47526501933');
    this.getContas('47526501933');
  }

  private getSaldoTotal(cpf: string): void {
    this.service.getSaldoConta(cpf).subscribe((response) => {
      response.saldo = 2000;
      this.saldoTotal = response;
    });
  }

  private getContas(cpf: string): void {
    this.service.getDadosContas(cpf).subscribe((response) => {
      this.dadosUsuario = response;
    });
  }
}
