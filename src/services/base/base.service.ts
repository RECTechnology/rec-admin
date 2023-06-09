import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';
import { XHR } from '../xhr/xhr';
import { API_URL } from '../../data/consts';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

export interface BaseServiceOptions {
  flags?: {
    translateHeaders: boolean,
  };
  headers: { [key: string]: string };
}

@Injectable()
export class BaseService {

  public xhr: XHR;
  public opts: BaseServiceOptions;
  public DEFAULT_OPTS = {
    flags: {
      translateHeaders: false,
    },
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
  };

  constructor(
    public http: HttpClient,
    public us: UserService,
  ) {
    this.xhr = new XHR();
    this.opts = this.DEFAULT_OPTS;
  }

  public setFlag(name: string, on: boolean = true) {
    this.opts.flags[name] = on;
  }

  public getFlag(name: string) {
    return this.opts.flags[name] || false;
  }

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

  public getHeaders(overwriteHeaders: any = {}): HttpHeaders {
    const headers = new HttpHeaders({
      authorization: 'Bearer ' + this.getToken(),
      ...this.opts.headers,
      ...this.getAdditionalHeaders(),
      ...overwriteHeaders,
    });
    return headers;
  }

  public getAdditionalHeaders(): ({ [k: string]: string }) {
    const headers = {};
    if (this.getFlag('translateHeaders')) {
      headers['Content-Language'] = 'true';
      headers['Accept-Language'] = 'true';
    }
    return headers;
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

  public get(
    id?: string, params?: any, url?: string,
    overwriteHeaders: any = {}, overwriteOptions: any = {},
  ): Observable<any> {
    const headers = this.getHeaders(overwriteHeaders);
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

  public delete(id?: string, url?: string, params: any = {}, overwriteHeaders: any = {}): Observable<any> {
    const headers = this.getHeaders(overwriteHeaders);
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

  public post(
    data: any, id: string,
    url: string, content_type: string = 'application/json',
    overwriteHeaders: any = {},
  ): Observable<any> {
    const headers = this.getHeaders({ 'content-type': content_type, ...overwriteHeaders });
    const options = { headers };

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

  public patch(data, id?: string, url?: string, overwriteHeaders: any = {}): Observable<any> {
    const headers = this.getHeaders(overwriteHeaders);
    const options = { headers };

    return this.http.patch(
      url || this.getUrl(id),
      data,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public put(
    data: any, id: string,
    url: string, content_type: string = 'application/json',
    overwriteHeaders: any = {},
  ): Observable<any> {
    const headers = this.getHeaders({ 'content-type': content_type, ...overwriteHeaders });
    const options = { headers };

    let params = null;
    if (content_type === 'application/x-www-form-urlencoded') {
      params = new HttpParams();
      for (const key in data) {
        if (key !== 'grant_types') {
          params = params.set(key, data[key]);
        }
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

  public extractData(res: any) {
    return res;
  }

  public handleError(error: Response | any) {
    let cleanError = error;
    const errStr = error.error || error;

    if (typeof errStr === 'string') {
      try {
        cleanError = JSON.parse(errStr);
      } catch (error) {
        cleanError = errStr;
      }
    }
    return throwError(cleanError);
  }
}
