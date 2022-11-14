import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { throwError } from 'rxjs/internal/observable/throwError';

import { XHR } from './xhr/xhr';
import { API_URL } from '../data/consts';
import { User } from 'src/shared/entities/user.ent';

@Injectable()
export class UserService {
  public userData: any = { group_data: {} };
  public lang = 'esp';
  public tokens: any = {};
  public isAdmin = false;
  public uploadprogress$;
  public progressObserver;
  @Output() public onLogout: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private xhr: XHR) {
    this.uploadprogress$ = new Observable((observer) => (this.progressObserver = observer));
  }

  public getGroupId(): string {
    return this.userData.group_data.id;
  }

  public _isAdmin(): boolean {
    const roles = this.userData.group_data.roles;
    return (this.isAdmin = roles.includes('ROLE_ADMIN'));
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
      accept: 'application/json',
      authorization: 'Bearer ' + this.tokens.access_token,
      'content-type': ctype || 'application/json',
    });
  }

  public canEdit(prop) {
    return true;
  }

  public addUserToAccount(account_id, user_dni, role): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    return this.http
      .post(`${API_URL}/manager/v1/groups/${account_id}`, { user_dni, role }, options)
      .pipe(map(this.extractData), catchError(this.handleError.bind(this)));
  }

  public getCurrency() {
    return this.userData.group_data.default_currency;
  }

  public getProfile(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers, method: 'GET' };

    return this.http.get(`${API_URL}/user/v1/account`, options).pipe(
      map((res: any) => {
        const body = res;
        if (!body.data.group_data.wallets || !body.data.group_data.wallets[0]) {
          body.data.group_data.wallets = [{ available: 0, balance: 0 }];
        } else {
          body.data.group_data.wallets[0].available = body.data.group_data.wallets[0].available / 100000000;
          body.data.group_data.wallets[0].balance = body.data.group_data.wallets[0].balance / 100000000;
        }

        try {
          const parsed = JSON.parse(body.data.kyc_validations.phone);
          body.data.kyc_validations.phone = parsed.number;
          body.data.kyc_validations.prefix = parsed.prefix;
        } catch (error) {
          // noop
        }

        return new User(body.data || body || {});
      }),
      catchError(this.handleError.bind(this)),
    );
  }

  public updateProfile(data) {
    const headers = this.getHeaders();
    const options = { headers, method: 'PUT' };

    return this.http
      .put(`${API_URL}/user/v1/account`, data, options)
      .pipe(map(this.extractData), catchError(this.handleError.bind(this)));
  }

  public updateKyc(data) {
    const headers = this.getHeaders('application/x-www-form-urlencoded');
    const options = { headers, method: 'POST' };

    return this.http
      .post(`${API_URL}/user/v1/save_kyc`, data, options)
      .pipe(map(this.extractData), catchError(this.handleError.bind(this)));
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

  public logout() {
    this.onLogout.emit();
  }

  public extractData(res: any) {
    return res;
  }

  public handleError(error: Response | any) {
    return throwError(error);
  }
}
