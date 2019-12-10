import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import Transaction from '../../shared/entities/transaction/transaction.ent';
import { WalletService } from '../wallet/wallet.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';

function formatTX(tx) {
  const new_tx = new Transaction();

  // new_tx.actions = this.getActionsForTransaction(tx);
  new_tx.scaled = (tx.amount / Math.pow(10, tx.scale)).toFixed(tx.scale);
  new_tx.isIn = tx.total > 0;
  new_tx.unitsScaled = this.ws.scaleNum(tx.amount, tx.scale);
  new_tx.method = tx.method;
  new_tx.id = tx.id;
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

@Injectable()
export class TransactionService extends BaseService {

  public latest: any[] = [];
  public earnings_year: any[] = [];
  public earnings: any = {};
  public dailyCustom;
  public walletTransactions: any[] = [];
  public alerts: any[] = [];
  public totalWalletTransactions = 0;
  public scales: any[] = [];

  constructor(
    http: HttpClient,
    public us: UserService,
    private ws: WalletService,
  ) { super(http, us); }

  public getLast50(filterData): Observable<any> {
    return this.get(null, filterData, `${API_URL}/system/v1/last50`).pipe(
      map((resp) => {
        resp.data = resp.data.map(formatTX.bind(this));
        return resp;
      }),
      catchError(this.handleError.bind(this)),
    );
  }

  public listTx(
    search = '', offset = 0,
    limit = 10, sort = 'id',
    order = 'desc', start_date?, finish_date?,
  ): Observable<any> {
    return this.get(null, {
      finish_date, limit,
      offset, order, sort, start_date,
    }, `${API_URL}/admin/v1/transaction/list`).pipe(
      map(
        (resp) => {
          console.log('resp');
          const res = {
            data: [],
            total: resp.data.total,
          };
          res.data = resp.data.list.map((d) => {
            const [
              id,
              sender_id, sender_type, sender_subtype,
              receiver_id, receiver_type, receiver_subtype,
              service, internal, status, amount, date,
            ] = d;
            return {
              amount: (amount / 100000000).toFixed(2), date,
              id, internal,
              receiver_id, receiver_subtype, receiver_type,
              sender_id, sender_subtype, sender_type,
              service, status,
            };
          });
          return res;
        }),
    );
  }

  public getVendorDataForAddress(address) {
    return this.get(null, { address }, `/transaction/v1/vendor`);
  }

  public getTxForAccount(id, offset = 0, limit = 10, start_date, finish_date, sort = 'id', order = 'desc') {
    return this.get(null, {
      finish_date, limit,
      offset, order, sort, start_date,
    }, `${API_URL}/company/${id}/v1/wallet/transactions`).pipe(
      map((resp) => {
        resp.data.elements = resp.data.elements.map(formatTX.bind(this));
        return resp;
      }));
  }

  public getTxById(id) {
    return this.get(null, {}, `${API_URL}/admin/v1/transaction/${id}`)
      .pipe(map((resp) => {
        return formatTX.bind(this)(resp.data.transaction);
      }));
  }

  /**
   * @param {String} company_id - The id to get transactions from
   * @param {Object} data       - The get parameters
   * @return {Observable}
   */
  public getChartTransactions(company_id: string, data: any) {
    return this.get(null, data, `${API_URL}/user/v2/wallet/transactions`)
      .pipe(
        map((el) => {
          el.data.elements = el.data.elements.map(formatTX.bind(this));
          return el;
        }),
      );
  }

  /**
   * @param {String} company_id - The id to get transactions from
   * @param {Object} data       - The get parameters
   * @return {Observable}
   */
  public getChartTransactionsRaw(company_id: string, data: any) {
    return this.get(null, data, `${API_URL}/user/v2/wallet/transactions`);
  }

  public sendTx(sender, receiver, concept, sec_code, amount) {
    return this.post({
      amount, concept, receiver, sec_code, sender,
    }, null, `${API_URL}/admin/v1/third/rec`);
  }

  /**
   * @param {String} comment - The comment to add to tx
   * @param {String} tx_id   - The tx to add comment to
   * @return {Observable}
   */
  public addCommentToTransaction(comment: string, tx_id: string) {
    return this.put({ comment }, null,
      `${API_URL}/company/v1/wallet/transaction/${tx_id}`,
      'application/x-www-form-urlencoded');
  }
}
