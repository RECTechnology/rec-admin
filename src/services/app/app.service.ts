import { Injectable, VERSION } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BaseService2 } from '../base/base.service-v2';

type DashboardStatisticsSubject = 'private' | 'company' | 'transactions';

@Injectable()
export class AppService extends BaseService2 {

  public API_VERSION = 'pre';

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

  public getStatistics(subject: DashboardStatisticsSubject) {
    return this.get(`/admin/v3/dashboard/total/${subject}`).pipe(map((resp) => resp.data.total));
  }
}
