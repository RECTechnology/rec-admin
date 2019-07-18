import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ErrorManager } from '../error-manager/error-manager';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
* This class is intented to be used to extend from not
* to be used on it's self
*/
@Injectable()
export abstract class BaseService2 {

  constructor(
    public http: HttpClient,
    public errMan: ErrorManager,
  ) { }

  /**
   * Get the url for the http-call
   * @param  {String} id #optional - If the url should be for an item
   * @return {String} the url to make the call with
  */
  public getUrl(id?: any) {
    return environment.url;
  }

  public abstract getToken();

  /**
   * Realizes a GET request
   * @param  {String} id      #optional - is used to call this.getUrl(id?) with the id
   * @param  {Array}  params  #optional - the parameters to be passed to the request
   * @param  {String} url     #optional - if passed it will use this url instead of this.getUrl()
   * @return {Observable}     a Observable that resolves in the response
  */
  public get(id?: string, params?: any, url?: string): Observable<any> {
    const headers = new Headers({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json',
    });

    const searchParams: URLSearchParams = new URLSearchParams();
    if (params) {
      for (const key in params) {
        if (key) {
          const param = params[key];
          searchParams.set(key, param);
        }
      }
    }

    const options: any = ({
      headers,
      search: searchParams,
    });

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
  public delete(id?: string, url?: string): Observable<any> {
    const headers = new Headers({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json',
    });
    const options: any = ({
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
    const headers = new Headers({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': content_type || 'application/json',
    });

    const options: any = ({
      headers,
      method: 'POST',
    });

    let params = data;
    if (content_type === 'application/x-www-form-urlencoded') {
      params = new URLSearchParams();

      for (const key in data) {
        if (key) {
          params.set(key, data[key]);
        }
      }
      params = params.toString();
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
    const headers = new Headers({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json',
    });

    const options: any = ({
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
    const headers = new Headers({
      'Accept': 'application/json',
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': (content_type || 'application/json'),
    });

    const options: any = ({
      headers,
      method: 'PUT',
    });

    let params = null;
    if (content_type === 'application/x-www-form-urlencoded') {
      params = new URLSearchParams();

      for (const key in data) {
        if (key) {
          params.set(key, data[key]);
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
