import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../user.service';
import { XHR } from '../xhr/xhr';
import { API_URL } from '../../data/consts';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { REC_LANGS, RecLang } from 'src/types';
import { UtilsService } from '../utils/utils.service';

export interface BaseService2Options {
  base_url: string;
  flags?: {
    translateHeaders: boolean,
  };
  headers: { [key: string]: string };
  lang?: RecLang;
}

@Injectable()
export class BaseService2 {
  public xhr: XHR;
  public opts: BaseService2Options;
  public DEFAULT_OPTS = {
    base_url: API_URL,
    flags: {
      translateHeaders: false,
    },
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
    lang: REC_LANGS.EN,
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

  public getUrl(url?: any) {
    if (url && !url.map) {
      url = [url];
    }
    return [this.opts.base_url, ...url].join('');
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
      console.log(this.us.lang);
      this.opts.lang = UtilsService.getLocaleFromLang(this.us.lang);
      headers['Content-Language'] = this.opts.lang || REC_LANGS.EN;
      headers['Accept-Language'] = this.opts.lang || REC_LANGS.EN;
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
    url?: string | string[], params?: any,
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
      this.getUrl(url),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public delete(url: string | string[], data: any = {}, overwriteHeaders: any = {}): Observable<any> {
    const headers = this.getHeaders(overwriteHeaders);
    const options = {
      body: data,
      headers,
    };

    return this.http.delete(
      this.getUrl(url),
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public post(
    url: string | string[], data: any,
    content_type: string = 'application/json',
    overwriteHeaders: any = {},
  ): Observable<any> {
    const headers = this.getHeaders({ 'Content-Type': content_type, ...overwriteHeaders });
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
          params = params.append(key, data[key]);
        }
      }
    }

    console.log('POST', url, params, options);
    return this.http.post(
      this.getUrl(url),
      params,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public patch(url: string | string[], data: any, overwriteHeaders: any = {}): Observable<any> {
    const headers = this.getHeaders(overwriteHeaders);
    const options = { headers };

    return this.http.patch(
      this.getUrl(url),
      data,
      options,
    ).pipe(
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public put(
    url: string | string[], data: any, content_type: string = 'application/json',
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
      this.getUrl(url),
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
