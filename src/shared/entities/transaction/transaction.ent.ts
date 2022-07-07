/* tslint:disable */
export default class Transaction {

  public amount: number = 0;

  public total: number = 0;

  public currency: string = '';

  public scaled: number | string = 0;

  public isIn: boolean = false;

  public unitsScaled: number = 0;

  public id: string = null;

  public group: number = 0;

  public pay_out_info?: PayOutInfo = null;

  public pay_in_info?: PayInInfo = null;

  public data_in: object = {};

  public refund_txs: [];

  public refund_parent_transaction: Transaction;

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

export function formatTX(tx) {
  const new_tx = new Transaction();

  // new_tx.actions = this.getActionsForTransaction(tx);
  new_tx.scaled = (tx.amount / Math.pow(10, tx.scale)).toFixed(tx.scale);
  new_tx.isIn = tx.total > 0;
  new_tx.unitsScaled = this.ws.scaleNum(tx.amount, tx.scale);
  new_tx.method = tx.method;
  new_tx.id = tx.id;
  new_tx.group = tx.group;
  new_tx.refund_txs = tx.refund_txs;
  new_tx.refund_parent_transaction = tx.refund_parent_transaction;
  new_tx.pay_out_info = tx.pay_out_info;
  new_tx.pay_in_info = tx.pay_in_info;
  new_tx.data_in = tx.data_in;
  new_tx.service = tx.service;
  new_tx.scale = tx.scale;
  new_tx.status = tx.status;
  new_tx.type = tx.type;
  new_tx.updated = tx.updated;
  new_tx.internal = tx.internal;
  new_tx.created = tx.created;
  new_tx.fixed_fee = tx.fixed_fee;
  new_tx.variable_fee = tx.variable_fee;
  new_tx.amount = tx.amount;
  new_tx.total = tx.total;
  new_tx.currency = tx.currency;
  new_tx.ip = tx.ip;

  if (new_tx.type === 'exchange') {
    const dt = tx.data_in;

    new_tx.scales = {
      from: dt.from,
      to: dt.to,
    };

    const fromScale = this.ws.getScaleForCurrency(new_tx.scales.from);
    const toScale = this.ws.getScaleForCurrency(new_tx.scales.to);

    if (new_tx.pay_in_info) {
      const actualPrice = 1 / (new_tx.pay_in_info.price * Math.pow(10, fromScale - toScale));
      new_tx.actual_price = actualPrice.toFixed(toScale);
    } else if (new_tx.pay_out_info) {
      const actualPrice = 1 * (new_tx.pay_out_info.price / Math.pow(10, toScale - fromScale));
      new_tx.actual_price = actualPrice.toFixed(toScale);
    }
  }
  return new_tx;
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
