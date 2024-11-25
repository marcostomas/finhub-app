import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public saldoTotal: any;
  public dadosUsuario: any;
  constructor(private service: HomeService) {}

  ngOnInit() {
    this.getSaldoTotal('47526501933');
    this.getContas('47526501933');
  }

  private getSaldoTotal(cpf: string): void {
    this.saldoTotal = [];

    this.service.getSaldoConta(cpf).subscribe((response) => {
      this.saldoTotal = response;
    });
  }

  private getContas(cpf: string): void {
    this.dadosUsuario = [];

    this.service.getDadosContas(cpf).subscribe((response) => {
      this.dadosUsuario = response;
    });
  }
}
