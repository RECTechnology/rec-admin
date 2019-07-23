import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';
import { ErrorManager } from '../error-manager/error-manager';
import { XHR } from '../xhr/xhr';
import { API_URL } from '../../data/consts';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
* This class is intented to be used to extend from not to be used on it's self
*/
@Injectable()
export class BaseService {
  public xhr: XHR;
  constructor(
    public http: HttpClient,
    public us: UserService,
    public errMan: ErrorManager,
  ) {
    this.xhr = new XHR();
  }

  /**
   * Get the url for the http-call
   * @param  {String} id #optional - If the url should be for an item
   * @return {String} the url to make the call with
  */
  public getUrl(id?: any) {
    return API_URL || environment.url;
  }

  /**
   * Get the token for the http-call
   * @return {String} the access token to be used
  */
  public getToken() {
    return this.us.tokens.access_token;
  }

  public xhrcall(data, method, path, contentType) {
    const params = new FormData();
    for (const key in data) {
      if (key) {
        params.append(key, data[key]);
      }
    }
    return this.xhr.call({
      authorization: 'Bearer ' + this.getToken(),
      contentType: contentType || 'application/json',
      data: params,
      method: 'POST',
      url: `${this.getUrl()}/${path}`,
    });
  }

  /**
   * Realizes a GET request
   * @param  {String} id      #optional - is used to call this.getUrl(id?) with the id
   * @param  {Array}  params  #optional - the parameters to be passed to the request
   * @param  {String} url     #optional - if passed it will use this url instead of this.getUrl()
   * @return {Observable}     a Observable that resolves in the response
  */
  public get(
    id?: string, params?: any, url?: string,
    overwriteHeaders: any = {}, overwriteOptions: any = {},
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json',
      ...overwriteHeaders,
    });

    let searchParams: HttpParams = new HttpParams();

    if (params instanceof Array) {
      for (const param of params) {
        if (String(param.value).toString() === '[object Object]') {
          param.value = JSON.stringify(param.value);
        }
        searchParams = searchParams.append(param.key, param.value);
      }
    } else if (params) {
      for (const key in params) {
        if (key) {
          let param = params[key];
          if (String(param).toString() === '[object Object]') {
            param = JSON.stringify(param);
          }
          searchParams = searchParams.append(key, param);
        }
      }
    }

    const options = {
      headers,
      params: searchParams,
      ...overwriteOptions,
    };

    return this.http.get(
      url || this.getUrl(id),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  /**
   * Realizes a DELETE request
   * @param  {String} id      #optional - is used to call this.getUrl(id?) with the id
   * @param  {String} url     #optional - if passed it will use this url instead of this.getUrl()
   * @return {Observable}     a Observable that resolves in the response
  */
  public delete(id?: string, url?: string, params: any = {}): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json',
    });
    const options = ({
      body: params,
      headers,
      method: 'DELETE',
    });

    return this.http.delete(
      url || this.getUrl(id),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  /**
   * Realizes a POST request
   * @param  {Object} data #optional - data to be sent in the POST request
   * @param  {String} id   #optional - is used to call this.getUrl(id?) with the id
   * @param  {String} url  #optional - if passed it will use this url instead of this.getUrl()
   * @return {Observable}  a Observable that resolves in the response
  */
  public post(data, id: string, url: string, content_type?): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': content_type || 'application/json',
    });

    const options = ({
      headers,
      method: 'POST',
    });

    let params = data;
    if (content_type === 'application/x-www-form-urlencoded') {
      params = new HttpParams();
      for (const key in data) {
        if (key !== 'grant_types') { params.set(key, data[key]); }
      }
      if (data.grant_types) {
        for (const gtype of data.grant_types) {
          params = params.append('allowed_grant_types[]', gtype);
        }
      }
      params = params.toString();
    }
    if (content_type === 'multipart/form-data') {
      params = new FormData();
      for (const key in data) {
        if (key) {
          params.append(key, data[key]);
        }
      }
    }

    return this.http.post(
      url || this.getUrl(id),
      params,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  /**
   * Realizes a PATCH request
   * @param  {Object} data #optional - data to be sent in the PATCH request
   * @param  {String} id   #optional - is used to call this.getUrl(id?) with the id
   * @param  {String} url  #optional - if passed it will use this url instead of this.getUrl()
   * @return {Observable}  a Observable that resolves in the response
  */
  public patch(data, id?: string, url?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json',
    });

    const options = ({
      headers,
      method: 'PATCH',
    });

    return this.http.patch(
      url || this.getUrl(id),
      data,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public put(data, id: string, url: string, content_type?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': (content_type || 'application/json'),
    });

    const options = ({
      headers,
      method: 'PUT',
    });

    let params = null;
    if (content_type === 'application/x-www-form-urlencoded') {
      params = new HttpParams();
      for (const key in data) {
        if (key !== 'grant_types') { params.set(key, data[key]); }
      }
      if (data.grant_types) {
        for (const gtype of data.grant_types) {
          params = params.append('allowed_grant_types[]', gtype);
        }
      }
    }

    return this.http.put(
      url || this.getUrl(id),
      params || data,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  /* Utils */
  public mapDateStringToDate(prop) {
    return (el) => {
      const d = el[prop];
      el.updated = new Date(d);
      return el;
    };
  }

  public extractData(res: any) {
    return res;
  }

  public handleError(error: Response | any) {
    return throwError(error);
  }
}
