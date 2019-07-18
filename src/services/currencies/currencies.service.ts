import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import { ErrorManager } from '../error-manager/error-manager';
import { Currency, Crypto, Fiat } from '../../shared/entities/currency/currency';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Ticker } from '../../shared/entities/ticker/ticker';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CurrenciesService extends BaseService {
  public currencies: any[] = [];
  public tickers: any = [];
  public cryptos = {};
  public services = {};
  public preferedCurrency: string | Currency = 'EUR';
  public settings: any = {};

  constructor(
    http: HttpClient,
    public us: UserService,
    public errMan: ErrorManager,
  ) { super(http, us, errMan); }

  /**
  * Gets all tickers for specified currency
  * @param {String} currency - The currency to get tickers
  * @return {Observable}
  */
  public getTickers(currency: string | Currency): Observable<any> {
    return this.get(null, {}, `${API_URL}/exchange/v1/ticker/${currency}`);
  }

  public indexOf(symbol: string): number {
    for (let index = 0; index < this.currencies.length; index++) {
      const element = this.currencies[index];
      if (element.symbol === symbol) {
        return index;
      }
    }
    return -1;
  }

  /**
  * Gets summary for all tickers
  * @return {Observable}
  */
  public getSummaryTickers(): Observable<any> {
    return this.get(null, {}, `${API_URL}/exchange/v1/summary_tickers`);
  }

  public isCurrencyEnabled(currency_name) {
    if (typeof this.settings.currencies === 'undefined') { return true; }
    return this.settings.currencies
      ? this.settings.currencies[currency_name] === 'enabled'
      : this.settings.currencies[currency_name] === 'disabled'
        ? false
        : true;
  }

  public doGetTickers(userCurrency, settings) {
    this.getTickers(userCurrency)
      .subscribe(
        (resp) => {
          const tickers = resp.data;
          const keys = Object.keys(tickers);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = tickers[key];
            const [currIn, currOut] = key.split('x');
            if (this.isCurrencyEnabled(currIn)) {
              this.tickers[i] = new Ticker(key, value, currIn, currOut, 1);
            }
          }
          this.tickers = this.tickers.filter((_) => _);
        }, (error) => { return; });
  }

  public getTickerPrice(currency: string): Observable<any> {
    const filtered = (this.tickers.filter((t) =>
      t.currIn === currency));
    return filtered.length ? filtered[0].value : 0;
  }

  /**
   * Version 1 of get currencies
   * no need to use this use v2
   */
  public getCurrencies(): Observable<any> {
    return this.get(null, {}, `${API_URL}/exchange/v1/currencies`);
  }

  /**
   * Version 2 of get currencies
   * it returns the currency names, type and scale for better management
   */
  public getCurrenciesV2(): Observable<any> {
    return this.get(null, {}, `${API_URL}/exchange/v2/currencies`)
      .pipe(map((resp) => {
        return resp.data.map((e) => Currency.fromType(e.type, e.currency, e.scale));
      }));
  }

  /**
  * @param {String} currency - The currency to get tickers
  * @return {Observable}
  */
  public updateCurrency(currency: string): Observable<any> {
    return this.put({ currency }, null, `${API_URL}/user/v1/currency`);
  }

  /**
  * @param {String} method - the cash in method ie: 'btc', 'swift'
  * @return {Observable}
  */
  public getCashInData(method: string): Observable<any> {
    return this.get(null, {}, `${API_URL}/company/v1/wallet/cash_in_token/${method}`);
  }

  /**
  * Gets a ticker
  * @param {String} currency - the currency
  * @return {Observable}
  */
  public getTicker(currency: string): Observable<any> {
    return this.get(null, {}, `${API_URL}/exchange/v2/ticker/${currency}`);
  }

  /**
  * Gets public ticker
  * @param {String} pair - the currency pair ie: BTC_EUR
  * @return {Observable}
  */
  public getPublicTicker(pair: string): Observable<any> {
    return this.get(null, {}, `${API_URL}/public/v1/tickers/${pair}`);
  }

  /**
  * Gets feex for exchange
  * @param {String} group_id - the group id
  * @param {String} exchange - the echange type ie: 'BTCtoEUR'
  * @return {Observable}
  */
  public getExchangeFees(group_id: string, exchange: string): Observable<any> {
    return this.get(null, {}, `${API_URL}/account/${group_id}/v1/fees/exchange_${exchange}`);
  }

  /**
  * Does exchange
  * @param {String} from   - From currency
  * @param {String} to     - To currency
  * @param {number} amount - The amount to exchange
  * @return {Observable}
  */
  public exchangeCurrencies(from: string, to: string, amount: number): Observable<any> {
    return this.post({
      amount,
      from,
      to,
    }, null, `${API_URL}/user/v1/wallet/currency_exchange`, 'application/x-www-form-urlencoded');
  }
}
