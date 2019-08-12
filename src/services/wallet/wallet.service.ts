import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import { ErrorManager } from '../error-manager/error-manager';
import { Wallet } from '../../shared/entities/wallet/wallet';
import { PrepaidCardMulti } from '../../shared/entities/prepaid_card/prepaid_card';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../base/base.service';

declare let _;
// Sorts elements by status 'available' first
const sortActive = (a, b) => (a === b) ? 0 : (a.status === 'available' ? -1 : 1);

@Injectable()
export class WalletService extends BaseService {
  public wallets: any[] = [];
  public methods: any[] = [];
  // tslint:disable-next-line
  public in_methods: any[] = [];
  // tslint:disable-next-line
  public out_methods: any[] = [];
  public fees: any[] = [];
  public exchanges: any[] = [];
  public difference: any = null;
  // tslint:disable-next-line
  public total_available: any = {
    available: 0,
    currency: '',
  };
  public cryptos = ['CREA', 'ETH', 'BTC', 'FAIR', 'FAC'];
  public fiat = ['transfer_mex', 'sepa', 'transfer'];
  public alternatives = ['easypay', 'teleingreso'];
  public hiddenMethods = [
    'halcash_es',
    'halcash_pl',
    'cryptocapital',
  ];
  public userFavs = [];
  private shownWallets: number = 0;

  constructor(
    http: HttpClient,
    public us: UserService,
    private snackbar: MySnackBarSevice,
  ) {
    super(http, us);
    this.userFavs = JSON.parse(localStorage.getItem('user-favs') || '[]');
    this.sortFavs();
  }

  /**
   * Returns the current `access_token`
   * @return {string} string
   */
  public getToken(): string {
    return this.us.tokens.access_token;
  }

  /**
   * Checks if a favorite item exists
   * @param {string} name - The name of the favorite you want to check
   * @param {string} direction - The direction of the method. One of `[in, out]`
   * @return {boolean} string
   */
  public isFavorite(name, direction): boolean {
    if (name === 'opex') {
      name = 'prepaidcards';
    }
    return this.userFavs.some((e) => e.name === name && e.direction === direction);
  }

  /**
   * Select favorite and add to `this.userFavs`
   * @param {string} name - The name of the favorite you want to check
   * @param {string} type - The type of the method. `['Bank', 'Crypto', 'Alternatives']`
   * @param {string} dir - The direction of the method. One of `[in, out]`
   * @param {Object} method - The direction of the method. One of `[in, out]`
   */
  public selectFavorite(name, type, direction, method) {
    if (!this.isFavorite(name, direction)) {
      if (name === 'opex' || name === 'spark') {
        name = 'prepaidcards';
      }
      this.userFavs.push({
        direction,
        method,
        name,
        title: name + ' ' + type,
        type,
        typeSelected: type ? true : false,
      });
      localStorage.setItem('user-favs', JSON.stringify(this.userFavs));
      this.snackbar.open('Added ' + name + ' ' + type + ' as favorite', 'ok', { duration: 3500 });
    } else {
      const fav = this.getFavorite(name, direction);
      this.removeFavorite(fav);
    }
    this.sortFavs();
  }

  /**
   * Removes favorite if it exists
   * @param {any} fav - The favorite object
   * @param {string} fav.name - The name of the favorite
   * @param {string} fav.type - The type of the favorite
   * @param {string} fav.typeSelected - If it has any type selected
   * @param {string} fav.direction - The direction of the method. One of `[in, out]`
   * @param {any} fav.method - The method itself
   */
  public removeFavorite(fav) {
    const index = this.userFavs.indexOf(fav);
    if (index !== -1) {
      this.userFavs.splice(index, 1);
    }
    localStorage.setItem('user-favs', JSON.stringify(this.userFavs));
    this.snackbar.open('Removed ' + fav.name + ' ' + fav.type + ' from favorites', 'ok', { duration: 3500 });
    this.sortFavs();
  }

  /**
   * Gets favorite by name
   * @param {string} name - The name of the favorite you want to get
   * @param {string} dir #optional - The direction. One of `[in, out]`
   */
  public getFavorite(name, dir?) {
    if (name === 'opex' || name === 'spark') {
      name = 'prepaidcards';
    }
    return (this.userFavs.filter((e) => e.name === name && e.direction === dir) || [undefined])[0];
  }

  /**
   * Gets all wallets for user
   * @return {Observable<any>}
   */
  public getWallets(): Observable<any> {
    return this.get(null, {}, `${API_URL}/user/v1/wallet`);
  }

  /**
   * Gets all methods for user
   * @return {Observable<any>}
   */
  public getMethods(): Observable<any> {
    return this.get(null, {}, `${API_URL}/company/${this.us.getGroupId()}/v1/methods`);
  }

  public getMethodByCname(cname, methods?) {
    return (this.methods.filter((e) => e.cname === cname) || [null])[0];
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
   * Gets all fees for user
   * @return {Observable<any>}
   */
  public getFees(): Observable<any> {
    return this.get(null, {}, `${API_URL}/account/${this.us.getGroupId()}/v1/fees`);
  }

  /**
   * Gets fees for specified method
   * @param {string} method - The method to get the fees for.
   * @return {Observable<any>}
   */
  public getFee(method: string): Observable<any> {
    return this.get(null, {}, `${API_URL}/account/${this.us.getGroupId()}/v1/fees/${method}`);
  }

  /**
   * Gets prepaid cards by type
   * @param {string} type - The card type. One of `['spark', 'opex']`
   * @return {Observable<any>}
   */
  public getPrepaidCards(type: string = 'opex'): Observable<any> {
    return this.get(null, {}, `${API_URL}/account/${this.us.getGroupId()}/v1/prepaidcards/${type}`)
      .pipe(map((resp) => resp.data.map((e) => new PrepaidCardMulti(e, type))));
  }

  /**
   * Validates prepaid card
   * @param {string} id - The db_id
   * @param {string} id_card - The id of the card. SAN
   * @param {string} type - The card type. One of `['spark', 'opex']`
   * @return {Observable<any>}
   */
  public validatePrepaidCard(id: string, id_card: string, type: string = 'opex'): Observable<any> {
    return this.put({ id_card }, null, `/account/${this.us.getGroupId()}/v1/prepaidcard/${type}/{id}`);
  }

  /**
   * Creates a new prepaid card for type
   * @param {any} data - The data to create a card
   * @param {string} data.address - The data to create a card
   * @param {string} data.country - The data to create a card
   * @param {string} data.city - The data to create a card
   * @param {string} data.document - The data to create a card
   * @param {string} data.nif_document - The data to create a card
   * @param {string} data.zip - The data to create a card
   * @param {string} data.name - The data to create a card
   * @param {string} data.surnames - The data to create a card
   * @param {string} type - The card type. One of `['spark', 'opex']` #default type 'opex'
   * @return {Observable<any>}
   */
  public createPrepaidCard(data: any, type: string = 'opex'): Observable<any> {
    return this.post(data, null, `${API_URL}/account/${this.us.getGroupId()}/v1/prepaidcard/${type}`);
  }

  /**
   * Creates a new prepaid card for type
   * @param {string} san - The SAN of the card
   * @param {string} type - The card type. One of `['spark', 'opex']` #default type 'opex'
   * @param {string} alias - An alias for the card
   * @param {string} expiry_date - The expiry date of the card
   * @return {Observable<any>}
   */
  public registerExistingPrepaidCard(card_id: string, type = 'opex', alias = '', expiry_date = ''): Observable<any> {
    return this.post({
      alias,
      card_id,
      expiry_date,
    }, null, `${API_URL}/account/${this.us.getGroupId()}/v1/prepaidcard/${type}/register`);
  }

  /**
   * Gets all cards in one call, opex and spark
   * @return {Observable<any>}
   */
  public getAllCards(): Observable<any> {
    return this.get(null, {}, `/account/${this.us.getGroupId()}/v1/prepaidcard/requested_cards`)
      .pipe(
        map((resp) => ({
          resp: resp.data.map((e) => new PrepaidCardMulti(e, e.type)),
          total: resp.total,
        })));
  }

  /**
   * Gets the limits for account
   * @return {Observable}
   */
  public getLimits(): Observable<any> {
    return this.get(null, {}, `${API_URL}/user/v1/limits`);
  }

  /**
   * Return cash in tokens for specified method
   * @param {string} method - The cash in type ie: 'btc', 'swift'
   * @return {Observable<any>}
   */
  public getCashInTokens(method: string): Observable<any> {
    return this.get(null, {}, `${API_URL}/company/v1/wallet/cash_in_token/${method}`);
  }

  /**
   * Creates a new token for specified method
   * @param {String} method - The cash in type ie: 'btc', 'swift'
   * @param {String} label  - A label for the new token
   * @return {Observable}
   */
  public createNewCashInToken(method: string, label: string): Observable<any> {
    return this.post({
      label,
      method,
    }, null, `${API_URL}/company/v1/wallet/cash_in_token`, 'application/x-www-form-urlencoded');
  }

  /**
   * Enables/ Disables the specified token
   * @param {string} id - The id of the token to update
   * @param {number} disable  - 0 or 1
   * @return {Observable<any>}
   */
  public updateCashInToken(id: string, disable: number = 1): Observable<any> {
    return this.put({
      disable,
    }, null, `${API_URL}/company/v1/wallet/cash_in_token/${id}`, 'application/x-www-form-urlencoded');
  }

  /**
   * @param {any[]} array - The array of fees
   * @param {boolean} shouldReturnValue - If true it return the new array, else it set this.exchanges
   */
  public orderFeesByCurrency(array?: any[], shouldReturnValue?: boolean): any[] {
    const curr = {};
    const iterable = array || this.fees;
    const returnValue = [];
    for (const fee of iterable) {
      const exchange = fee.service_name.match(/exchange_(.*)to(.*)/);
      if (exchange) {
        const exchange_curr = exchange[1];
        curr[exchange_curr] ? curr[exchange_curr].fees.push(fee) : curr[exchange_curr] = { fees: [fee] };
        curr[exchange_curr].name = `exchange_${exchange_curr}`;
      }
    }

    for (const key in curr) {
      if (key) {
        returnValue
          .push({
            cname: curr[key].name,
            currency: key,
            fees: curr[key].fees,
            image: 'https://pre-commerce.chip-chap.com/bundles/telepaycontrolpanel/\
            images/Wallet-coin-table-footer/exchange.png',
            limits: {},
            type: 'exchange',
          });
      }
    }
    this.exchanges = returnValue;
    return returnValue;
  }

  public getFeeForMethod(method) {
    return (this.fees.filter((fee) => fee.service_name === method) || [null])[0];
  }

  /**
   * @param {number} current_balance - The current wallet balance
   * @return {number} - return the difference between last and actual balance
   */
  public getDiferenceFromLastBalance(current_balance: number): number {
    const last_balance = +localStorage.getItem('wallet_balance') || 0;
    let difference = 0;

    if (last_balance && last_balance !== current_balance) {
      if (last_balance < current_balance) {
        difference = (Math.abs(current_balance) - Math.abs(last_balance));
      } else {
        difference = (Math.abs(current_balance) - Math.abs(last_balance));
      }
    }
    localStorage.setItem('wallet_balance', current_balance + '');
    return difference;
  }

  /**
   * @param {string} currency - name of currency
   * @return {number} - return the available amount for a specified currency
   * @return {boolean} - if returned value should be scaled
   */
  public getAvailable(currency: string, scale?: boolean): number {
    if (!currency) {
      return 0;
    }
    const find = _.find(this.wallets, (o) => o.currency === currency.toUpperCase());
    if (!find) {
      return 0;
    }
    if (currency) {
      return scale ? +this.scaleNum(+find.available, +find.scale) : +find.available;
    }
    return +this.total_available.available;
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
   * @param {string} type - method type ie: ('in' / 'out' / ...)
   * @param {string} array #optional
   *   - Will filter this array if passed
   *   - Else it will filter 'this.methods'
   * @param {boolean} returnAll #optional true if you want to recieve all the methods
   * @return {any[]} - return filtered methods
   */
  public getMethodsByType(type: string, array?: any[], returnAll = false): any[] {

    // Filters methods, they are removed if they are in hiddenMethods
    const methods = (array || this.methods).filter((m) =>
      m.type === type && this.hiddenMethods.indexOf(m.cname) === -1);
    const crypto = [];
    const bank = [];
    const alternatives = [];

    for (const c of methods) {
      const cin: any = c;
      if (this.cryptos.indexOf(cin.cname.toUpperCase()) !== -1) {
        crypto.push(cin);
      } else if (this.fiat.indexOf(cin.cname) !== -1) {
        bank.push(cin);
      } else if (cin.cname !== 'opex') {
        if (cin.cname === 'spark') {
          cin.cname = 'Spark/Opex';
        }
        alternatives.push(cin);
      }
    }

    if (returnAll) {
      return methods;
    }

    return [
      {
        direction: type,
        image: crypto[0].image,
        label: 'Cryptocurrencies',
        methods: crypto.sort(sortActive),
        type: 'crypto',
      },
      (bank.length ? {
        direction: type,
        image: bank[0].image,
        label: 'Banking Methods',
        methods: bank.sort(sortActive),
        type: 'bank',
      } : null),
      (alternatives.length ? {
        direction: type,
        image: alternatives[0].image,
        label: 'Alternative Methods',
        methods: alternatives.sort(sortActive),
        type: 'bank',
      } : null),
    ];
  }

  /**
   * isMethodDisabled
   */
  public isMethodDisabled(methodName) {
    const method = this.methods.filter((m) => m.cname === methodName);
    if (method.length) {
      return method.pop().status === 'unavailable';
    }
    return false;
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

  /**
   * @param {string} last_balance - the previous amount
   * @param {string} current_balance - the current amount
   * @return {number} - return the difference between both
   */
  public getDifference(last_balance, current_balance): number {
    if (last_balance && last_balance !== current_balance) {
      if (current_balance < last_balance) {
        return (Math.abs(current_balance) - Math.abs(last_balance));
      } else {
        return (Math.abs(last_balance) - Math.abs(current_balance));
      }
    }
  }

  /**
   * Does getWallet and sets data
   * @return {Observable}
   */
  public doGetWallets(): void {
    this.shownWallets = 0;
    this.getWallets()
      .subscribe((resp) => {
        this.total_available = resp.data[resp.data.length - 1];
        this.wallets = resp.data.splice(0, resp.data.length - 1)
          .map((wallet) => {
            if (wallet.status === 'enabled') {
              this.shownWallets += 1;
            }
            return new Wallet(wallet.currency, wallet.scale, wallet.available, wallet.status);
          });
        const scale = this.total_available.scale;
        this.total_available.available = (this.total_available.available / Math.pow(10, scale)).toFixed(scale);
        this.difference = this.getDiferenceFromLastBalance(this.total_available.available);
      }, (error) => { return; });
  }

  /**
   * Sorts favorites by direction `[in, out]`
   */
  private sortFavs() {
    this.userFavs = this.userFavs.sort((e) => {
      return e.direction === 'in' ? -1 : 1;
    });
  }
}
