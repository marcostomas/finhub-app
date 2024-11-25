export interface Saida {
  dataTransacao: Date;
  valorTransacao: number;
  nomeEmpresa: string;
}

export class DadosSaida implements Saida {
  constructor(
    public dataTransacao: Date,
    public valorTransacao: number,
    public nomeEmpresa: string
  ) {}
}
