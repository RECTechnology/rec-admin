/* tslint:disable */
export default class Transaction {

  public amount: number = 0;

  public total: number = 0;

  public currency: string = '';

  public scaled: number | string = 0;

  public isIn: boolean = false;

  public unitsScaled: number = 0;

  public id: string = null;

  public pay_out_info?: PayOutInfo = null;

  public pay_in_info?: PayInInfo = null;

  public data_in: object = {};

  public service: string = null;

  public ip: string = null;

  public scale: number = 0;

  public status: string = null;

  public type: string = null;

  public updated: string = null;

  public created: string = null;

  public fixed_fee: number = 0;

  public variable_fee: number = 0;

  public method: string = null;

  public actions: any = { enabled: [], disabled: [] };

  public scales: Scales = { from: '', to: '' };

  public actual_price?: number | string = 0;

  public internal: boolean = false;

  constructor() {

  }
}

interface Scales {
  from: string;
  to: string;
}

interface PayOutInfo {
  amount: number | string;
  concept: string;
  currency: string;
  final: boolean;
  scale: number;
  status: string;
  txid: string;
  price: number
}

interface PayInInfo {
  amount: number | string;
  concept: string;
  currency: string;
  final: boolean;
  scale: number;
  status: string;
  txid: string;
  price: number;
}
