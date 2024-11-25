export interface Entrada {
  dataTransacao: Date;
  valorTransacao: number;
  nomeEmpresa: string;
}

export class DadosEntrada implements Entrada {
  constructor(
    public dataTransacao: Date,
    public valorTransacao: number,
    public nomeEmpresa: string
  ) {}
}
