export interface DadosContasInterface {
  numeroConta: number;
  nomeBanco: string;
  saldo: number;
}

export class ContasUsuario implements DadosContasInterface {
  constructor(
    public numeroConta: number,
    public nomeBanco: string,
    public saldo: number
  ) {}
}
