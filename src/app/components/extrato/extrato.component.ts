import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExtratoService } from './extrato.service';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extrato.component.html',
  styleUrl: './extrato.component.css',
})
export class ExtratoComponent implements OnInit {
  public entradaUsuario: any;
  public saidaUsuario: any;
  public saldoTotal: any = { saldo: 0 };
  constructor(private service: ExtratoService) {}

  ngOnInit() {
    this.getSaldoTotal('47526501933');
    this.getEntradaData('47526501933');
    this.getSaidaData('47526501933');
  }

  private getSaldoTotal(cpf: string): void {
    this.service.getSaldoConta(cpf).subscribe((response) => {
      this.saldoTotal = response;
    });
  }

  private getEntradaData(cpf: string): void {
    this.entradaUsuario = [];

    this.service.getDadosEntrada(cpf).subscribe((response) => {
      this.entradaUsuario = response;
    });
  }

  private getSaidaData(cpf: string): void {
    this.saidaUsuario = [];
    this.service.getDadosSaida(cpf).subscribe((response) => {
      this.saidaUsuario = response;
    });
  }
}
