
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  A little service, that implements xhr to get progress of uploaded file
  If you want to get percentage of progress you have to pass it a observer as logProgress
  and will call it any time there is a progress update
*/

@Injectable()
export class XHR {
  public url: string;
  public data: any;
  public authorization: string;
  public method: string;
  public xhr: XMLHttpRequest;
  public logProgress: any = () => { return; };

  public call(obj: any): Observable<any> {
    this.url = obj.url;
    this.data = obj.data;
    this.authorization = obj.authorization;
    this.method = obj.method;
    this.logProgress = obj.onProgress || (() => { return; });

    return new Observable((observer: any) => {
      this.xhr = new XMLHttpRequest();
      const xhr = this.xhr;
      observer.abort = () => xhr.abort();

      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === 200 || this.xhr.status === 201) {
            observer.next(JSON.parse(this.xhr.response));
            observer.complete();
          } else {
            observer.error(JSON.parse(this.xhr.response));
          }
        }
      };
      this.xhr.upload.onprogress = (event: any) => {
        if (event.lengthComputable && this.logProgress.next) {
          const percentComplete = (event.loaded / event.total) * 100;
          this.logProgress.next(percentComplete);
        }
      };
      this.xhr.open(this.method, this.url);
      this.xhr.setRequestHeader('authorization', this.authorization);
      this.xhr.setRequestHeader('accept', obj.contentType || 'application/json');
      this.xhr.send(this.data || null);
    });
  }
}
