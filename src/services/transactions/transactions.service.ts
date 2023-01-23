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
import { formatTX } from '../../shared/entities/transaction/transaction.ent';
import { environment } from 'src/environments/environment';

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
  public currency = 'rec';

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
    limit?, sort = 'sender_id',
    order = 'desc', start_date?, finish_date?,
  ): Observable<any> {

    return this.get(null, {
      finish_date, limit, search,
      offset, order, sort, start_date,
    }, `${API_URL}/admin/v3/transactions`).pipe(
      map((resp) => {
        resp.data.elements = resp.data.list.map(formatTX.bind(this));
        return resp;
      }));
  }

  public refundTx(concept, sec_code, txid, amount, internal_in, internal_out){
    return this.post({
      amount, sec_code, txid, concept, internal_in, internal_out
    }, null, `${API_URL}/admin/v3/transaction/refund`);
  }

  public updateTx(id, data:any){
    const url = `${API_URL}/admin/v1/transaction/${id}`;
    return this.put(data, null, url);
  }

  public getVendorDataForAddress(address) {
    return this.get(null, { address }, `/transaction/v1/vendor`);
  }

  public getTxForAccount(id, offset = 0, limit = 10, start_date, finish_date, sort = 'id', order = 'desc',exchanges='all',methods_out='all',methods_in='all',) {

    return this.get(null, {
      limit,
      offset,
      order,
      sort,
      query: {finish_date, start_date,exchanges,
        methods_out,
        methods_in},
      
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

  public sendTx(sender, receiver, concept, sec_code, amount, internal_in, internal_out) {
    environment.crypto_currency ? this.currency = environment.crypto_currency : this.currency = 'rec';
    return this.post({
      amount, concept, receiver, sec_code, sender, internal_in, internal_out
    }, null, `${API_URL}/admin/v3/third/${this.currency}`);
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
