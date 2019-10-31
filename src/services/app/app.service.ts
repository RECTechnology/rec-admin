import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BaseService2 } from '../base/base.service-v2';

@Injectable()
export class AppService extends BaseService2 {
  constructor(
    http: HttpClient,
    public us: UserService,
  ) {
    super(http, us);
  }

  public getInfo() {
    return this.get(`/system/v1/version`);
  }

  public getStatus() {
    return this.get(`/public/v1/status`).pipe(map((resp) => resp.data));
  }
}
