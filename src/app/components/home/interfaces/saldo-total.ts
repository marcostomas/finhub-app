export interface SaldoTotal {
  saldo: string;
}

export class SaldoTotalHome implements SaldoTotal {
  constructor(public saldo: string) {}
}
