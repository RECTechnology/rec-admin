import { padStart } from '../../utils.fns';

export class Wallet {

  public currency: string = '';
  public scale: number = 0;
  public available: number = 0;
  private scaledPriv: any = {
    insignificant: '0000',
    significant: '0.00',
  };
  private status: string = 'enabled';

  constructor(currency, scale = 2, available = 0, status: string) {
    this.currency = currency;
    this.scale = scale;
    this.available = available;
    this.status = status;
    this.splitAvailable();
  }

  public splitAvailable() {
    const scaled: any = this.scaleNum();
    const scaledStr = scaled.toString();

    const e = parseInt(scaledStr, 10);
    const d3 = padStart((parseInt((scaledStr * Math.pow(10, 3)).toString(), 10) % Math.pow(10, 3)).toString(), 3);
    const i5 = padStart((
      parseInt(Math.round(scaledStr * Math.pow(10, 8)).toString(), 10) % Math.pow(10, 5)
    ).toString(), 5);

    this.scaledPriv = {
      insignificant: i5,
      significant: e + '.' + d3,
    };
  }

  get scaled() {
    this.splitAvailable();
    return this.scaledPriv;
  }

  public scaleNum(): number {
    return +(this.available / Math.pow(10, this.scale)).toFixed(this.scale);
  }
}
