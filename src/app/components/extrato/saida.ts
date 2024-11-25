export interface Saida {
  saldoTotal: number;
  saida: number;
  nomeEstabelecimento: string;
}

export class DadosSaida implements Saida {
  constructor(
    public saldoTotal: number,
    public saida: number,
    public nomeEstabelecimento: string
  ) {}
}
