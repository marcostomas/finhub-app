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
  constructor(private service: ExtratoService) {}

  ngOnInit() {
    this.getEntradaData();
    this.getSaidaData();
  }

  private getEntradaData(): void {
    this.entradaUsuario = [];

    this.service.getDadosEntrada().subscribe((response) => {
      this.entradaUsuario = response;
    });
  }

  private getSaidaData(): void {
    this.saidaUsuario = [];

    this.service.getDadosSaida().subscribe((response) => {
      this.saidaUsuario = response;
    });
  }
}
