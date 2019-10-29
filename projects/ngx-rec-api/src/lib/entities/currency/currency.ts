
export class Currency {

  public static TYPE_CRYPTO = 'crypto';
  public static TYPE_FIAT = 'fiat';

  public static fromType(type: string, symbol?, scale?) {
    if (type.toLowerCase() === Currency.TYPE_CRYPTO) {
      return new Crypto(symbol, scale);
    }
    if (type.toLowerCase() === Currency.TYPE_FIAT) {
      return new Fiat(symbol, scale);
    }
  }

  private symbolPriv: string = '';
  private typePriv: string = '';
  private scalePriv: number = 0;

  constructor(symbol, type = Currency.TYPE_CRYPTO, scale = 2) {
    this.symbolPriv = symbol;
    this.typePriv = type;
    this.scalePriv = scale;
  }

  public valueOf() {
    return this.symbol;
  }

  public toString() {
    return this.valueOf();
  }

  get scale(): number {
    return this.scalePriv;
  }

  set scale(scale: number) {
    this.scalePriv = scale;
  }

  get symbol(): string {
    return this.symbolPriv;
  }

  set symbol(symbol: string) {
    this.symbolPriv = symbol;
  }

  get type(): string {
    return this.typePriv;
  }

  set type(type: string) {
    this.typePriv = type;
  }
}

export class Crypto extends Currency {
  constructor(symbol: string = 'NULL', scale: number = 8) {
    super(symbol, Currency.TYPE_CRYPTO, scale);
  }
}

export class Fiat extends Currency {
  constructor(symbol: string = 'NULL', scale: number = 2) {
    super(symbol, Currency.TYPE_FIAT, scale);
  }
}
