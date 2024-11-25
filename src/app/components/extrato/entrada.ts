export interface Entrada {
  saldoTotal: number;
  entrada: number;
  nomeEstabelecimento: string;
}

export class DadosEntrada implements Entrada {
  constructor(
    public saldoTotal: number,
    public entrada: number,
    public nomeEstabelecimento: string
  ) {}
}
