export interface SaldoTotal {
  saldo: number;
}

export class SaldoTotalHome implements SaldoTotal {
  constructor(public saldo: number) {}
}
