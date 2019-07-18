import { Injectable, Output, EventEmitter } from '@angular/core';
import { XHR } from './xhr/xhr';
import { API_URL } from '../data/consts';
import { ErrorManager } from './error-manager/error-manager';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
  public userData: any = { group_data: {} };
  public lang = 'esp';
  public company: any = { id: 1 };
  public tokens: any = {};
  public companies: any[] = [];
  public companyUsers: any[] = [];
  public totalUsers = 0;
  public role: string = '';
  public strRole: string = '';
  public isAdmin = false;
  public isReseller = false;
  public currency = 'EUR';
  public total_balance = 1443.23;
  public hasAlerts = false;
  public needChangePassword = false;
  public uploadprogress$;
  public progressObserver;
  @Output() public onLogout: EventEmitter<any> = new EventEmitter();

  private disabled_items_props = {
    1: [
      'email',
    ],
    2: [
      'name',
      'last_name',
      'date_birth',
      'country',
      'prefix',
      'email',
      'phone',
      'address',
      'card_info',
    ],
  };

  constructor(
    private http: HttpClient,
    private xhr: XHR,
    public errMan: ErrorManager,
  ) {
    this.uploadprogress$ = new Observable((observer) => this.progressObserver = observer);
  }

  public getGroupId(): string {
    return this.userData.group_data.id;
  }

  public getUsername(): string {
    return this.userData.username;
  }

  public getName(): string {
    return this.userData.name;
  }

  public getSurnames(): string {
    return this.userData.kyc_data.last_name;
  }

  public getTier(): number {
    return this.userData.group_data.tier;
  }

  public notifyOnLogin() {
    return this.userData.settings.login_notification;
  }

  public getReferalCode(): number {
    return this.userData.group_data.referal_code;
  }

  public getDefaultCurrency(): string {
    return this.userData.group_data.default_currency.toUpperCase();
  }

  public getUserConfig(prop) {
    if (!(prop in this.userData.settings)) {
      // tslint:disable-next-line
      console.error(new Error(prop + ' is not a valid configuration property.'))
      return null;
    }
    return this.userData.settings[prop];
  }

  public _isAdmin(): boolean {
    const roles = this.userData.group_data.roles;
    return this.isAdmin = roles.includes('ROLE_ADMIN');
  }

  public isSuperAdmin(): boolean {
    const roles = this.userData.group_data.roles;
    return roles.includes('ROLE_SUPER_ADMIN');
  }

  public isCompany() {
    return true || this.userData.company_enabled;
  }

  public setData(data: any): void {
    this.userData = data;
  }

  public getHeaders(ctype?): HttpHeaders {
    return new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': ctype || 'application/json',
    });
  }

  public canEdit(prop) {
    return true;
  }

  /**
   * Gets group data with specified id
   * @param {string} id - The id of the group/account/company
   * @return {Observable<any>}
   */
  public getGroup(id: string): Observable<any> {
    return this.http.get(
      `${API_URL}/groups/v1/show/` + id,
      {
        headers: this.getHeaders(),
      })
      .pipe(
        map(this.extractData),
        catchError(this.handleError.bind(this)),
      );
  }

  /**
   * Adds a user to your account
   * @param {string} account_id - The id of the group/account/company
   * @param {object} email - The email of the user to add
   * @param {object} role - The role the user will have
   * @return {Observable<any>}
   */
  public addUserToAccount(account_id, email, role): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/x-www-form-urlencoded',
    });
    const options = ({ headers });
    const params = new URLSearchParams();

    params.set('user_dni', email);
    params.set('role', role);

    return this.http.post(
      `${API_URL}/manager/v1/groups/${account_id}`,
      params.toString(),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  /**
   * Adds a user to your account
   * @param {object} data - The data for the new user
   * @return {Observable<any>}
   */
  public createAndAddUser(data): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/x-www-form-urlencoded',
    });
    const options = ({ headers, method: 'POST' });
    const params = new URLSearchParams();

    for (const key in data) {
      if (key) {
        params.set(key, data[key]);
      }
    }

    return this.http.post(
      `${API_URL}/account/${this.getGroupId()}/v1/add_user`,
      params.toString(),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public removeAccount(id): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/json',
    });
    const options = ({ headers, method: 'DELETE' });

    return this.http.delete(
      `${API_URL}/manager/v1/groups/${id}`,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public removeAccountV2(reseller_id, user_id): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/json',
    });
    const options = ({ headers, method: 'DELETE' });

    return this.http.delete(
      `${API_URL}/company/${reseller_id}/v1/referer/${user_id}`,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public getCurrency() {
    return this.userData.group_data.default_currency;
  }

  public searchMap(search, filter, offset = 0, limit = 10, sort = 'id', order = 'DESC', rect_box = [-90, -90, 90, 90]) {
    const headers = this.getHeaders();
    const options: any = ({ headers });

    const searchParams = new URLSearchParams();
    searchParams.set('query', JSON.stringify({
      rect_box,
      search,
    }));
    searchParams.set('only_with_offers', filter.only_offers);
    searchParams.set('subtype', filter.retailer ? 'retailer' : (filter.wholesale ? 'wholesale' : null));
    searchParams.set('offset', String(offset));
    searchParams.set('limit', String(limit || 10));
    searchParams.set('order', order);
    searchParams.set('sort', sort);

    options.search = searchParams;

    return this.http.get(`${API_URL}/public/v2/map`, options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError.bind(this)),
      );
  }

  // /map/v1/visibility
  public getListOfRecSellers(offset, limit, search, sort = 'id', dir = 'desc') {
    const headers = this.getHeaders();
    const options: any = ({ headers, method: 'GET' });
    options.search = new URLSearchParams();
    options.search.set('offset', String(offset));
    options.search.set('limit', String(limit));
    options.search.set('search', String(search));
    options.search.set('sort', String(sort));
    options.search.set('dir', String(dir));

    return this.http.get(`${API_URL}/user/v1/wallet/exchangers`, options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError.bind(this)),
      );
  }

  public listMap(search, filter) {
    const headers = this.getHeaders();
    const options: any = ({ headers, method: 'GET' });
    options.search = new URLSearchParams();

    if (search) {
      options.search.set('search', search);
    }
    if (filter.only_offers) { options.search.set('only_offers', filter.only_offers); }
    if (filter.retailer) { options.search.set('retailer', filter.retailer); }
    if (filter.wholesale) { options.search.set('wholesale', filter.wholesale); }

    // /public/map/v1/list
    return this.http.get(`${API_URL}/public/map/v1/list`, options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError.bind(this)),
      );
  }

  public getProfile(): Observable<any> {
    const headers = this.getHeaders();
    const options = ({ headers, method: 'GET' });

    return this.http.get(
      `${API_URL}/user/v1/account`,
      options,
    ).pipe(
      map((res: any) => {
        const body = res.json();
        body.data.group_data.wallets[0].available = body.data.group_data.wallets[0].available / 100000000;
        body.data.group_data.wallets[0].balance = body.data.group_data.wallets[0].balance / 100000000;

        try {
          const parsed = JSON.parse(body.data.kyc_validations.phone);
          body.data.kyc_validations.phone = parsed.number;
          body.data.kyc_validations.prefix = parsed.prefix;
        } catch (error) {
          // tslint:disable-next-line
          console.log('error', error);
        }

        return body.data || body || {};
      }),
      catchError(this.handleError.bind(this)),
    );
  }
  public updateProfile(data) {
    const headers = this.getHeaders();
    const options = ({ headers, method: 'PUT' });

    return this.http.put(
      `${API_URL}/user/v1/account`,
      data,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public updateKyc(data) {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/x-www-form-urlencoded',
    });
    const options = ({ headers, method: 'POST' });
    const params = new URLSearchParams();

    for (const key in data) {
      if (key) {
        params.set(key, data[key]);
      }
    }

    return this.http.post(
      `${API_URL}/user/v1/save_kyc`,
      params.toString(),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  // Send one time pin to mail
  public sendOneTimePin() {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/x-www-form-urlencoded',
    });
    const options = ({ headers, method: 'PUT' });

    return this.http.put(`${API_URL}/user/v1/security/one_time_pin`, '', options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError.bind(this)),
      );
  }

  public request2faCode() {
    const headers = this.getHeaders();
    const options = ({ headers, method: 'PUT' });

    return this.http.put(
      `${API_URL}/user/v1/active2fa`,
      {},
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public validate2fa(code) {
    const headers = this.getHeaders();
    const options = ({ headers, method: 'PUT' });

    return this.http.put(
      `${API_URL}/user/v1/validate2fa`,
      { pin: code },
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public show2fa(code) {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/x-www-form-urlencoded',
    });
    const options = ({ headers, method: 'POST' });

    const params = new URLSearchParams();
    params.append('pin', code);

    return this.http.post(
      `${API_URL}/user/v1/show2fa`,
      params.toString(),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public deactivate2FA(code) {
    const headers = this.getHeaders();
    const options = ({ headers, method: 'PUT' });

    return this.http.put(
      `${API_URL}/user/v1/deactive2fa`,
      { pin: code },
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public uploadFileWithProgress(file): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.xhr.call({
      authorization: 'Bearer ' + this.tokens.access_token,
      data: form,
      method: 'POST',
      onProgress: this.progressObserver,
      url: `${API_URL}/user/v1/upload_file`,
    });
  }
  public uploadFile(file: File) {
    const headers = new HttpHeaders({
      accept: 'application/json',
      authorization: 'Bearer ' + this.tokens.access_token,
    });

    const options = ({ headers, method: 'POST' });

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(
      `${API_URL}/user/v1/upload_file`,
      formData,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public updateImage(src) {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'authorization': 'Bearer ' + this.tokens.access_token,
      'content-type': 'application/x-www-form-urlencoded',
    });
    const options = ({ headers, method: 'PUT' });

    const params = new URLSearchParams();

    params.set('profile_image', src);

    return this.http.put(
      `${API_URL}/user/v1/profile_image`,
      params.toString(),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  /**
   * @param title            { String } the report title
   * @param description      { String } the error description
   * @param snapshot         { File }   the site screenshot
   * @param errors #optional { File }   the site screenshot
   */
  public sendErrorReport(title: string, description: string, snapshot: File, errors?) {

    const options = ({
      headers: new HttpHeaders({
        'accept': 'application/json',
        'authorization': 'Bearer ' + this.tokens.access_token,
        'content-type': 'application/json',
      }),
      method: 'POST',
    });

    return this.http.post(
      `${API_URL}/issue/report`,
      {
        description,
        errors,
        snapshot,
        title,
      },
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public logout() {
    this.onLogout.emit();
  }

  private extractData(res: any) {
    const body = res.json();
    return body ? body.data : (body || {});
  }
  private handleError(error: Response | any) {
    if ('_body' in error) {
      error._body = JSON.parse(error._body);
    }
    this.errMan.addError(error);
    return Observable.throw(error);
  }
}
