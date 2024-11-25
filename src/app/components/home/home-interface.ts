export interface HomeInterface {
  conta: string;
  nomeEmpresa: string;
  saldoConta: number;
  saldoTotal: number;
}

export class ContasUsuario implements HomeInterface {
  constructor(
    public conta: string,
    public nomeEmpresa: string,
    public saldoConta: number,
    public saldoTotal: number
  ) {}
}
