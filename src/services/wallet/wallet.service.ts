import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';

declare let _;
const sortActive = (a, b) => (a === b) ? 0 : (a.status === 'available' ? -1 : 1);

@Injectable()
export class WalletService extends BaseService {
  public wallets: any[] = [];
  public difference: any = null;
  public total_available: any = {
    available: 0,
    currency: '',
  };

  constructor(
    http: HttpClient,
    public us: UserService,
  ) {
    super(http, us);
  }

  /**
   * Returns the current `access_token`
   * @return {string} string
   */
  public getToken(): string {
    return this.us.tokens.access_token;
  }

  /**
   * Gets all wallets for user
   * @return {Observable<any>}
   */
  public getWallets(): Observable<any> {
    return this.get(null, {}, `${API_URL}/user/v1/wallet`);
  }

  /**
   * @param {String} type - The cash out type ie: 'btc', 'swift'
   * @param {Object} data - The data to send
   * @return {Observable<any>}
   */
  public cashOut(type: string, data: any): Observable<any> {
    return this.post(data, null, `${API_URL}/methods/v1/out/${type}`, 'application/x-www-form-urlencoded');
  }

  /**
   * @param {string} currency - name of currency
   * @return {number} - return the scale for that currency
   */
  public getScaleForCurrency(currency: string): number {
    const find = _.find(this.wallets,
      (o) => o.currency && o.currency.toUpperCase() === currency.toUpperCase() && currency.toUpperCase());
    return find ? find.scale : 2;
  }

  public getDescaledAmount(currency, amount) {
    const scale = this.getScaleForCurrency(currency);
    return amount * (+Math.pow(10, scale).toFixed(scale));
  }

  /**
   * Scales a number for specified scale
   * @param {string} amount - number to scale
   * @param {string} scale - the scale
   * @return {number} - return the scaled amount
   */
  public scaleNum(amount: number, scale: number): number {
    return amount ? +(amount / Math.pow(10, scale)).toFixed(scale) : 0;
  }
}
