import { Injectable } from '@angular/core';
import { BaseService2 } from '../base/base.service-v2';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

type DashboardStatisticsSubject = 'private' | 'company' | 'transactions' | 'balance';
type DashboarValidIntervals = 'year' | 'month' | 'day';
type DashboarValidSeries = 'registers' | 'transactions';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService2 {
  constructor(
    http: HttpClient,
    public us: UserService,
  ) {
    super(http, us);
  }

  public getStatistics(subject: DashboardStatisticsSubject) {
    return this.get(`/admin/v3/dashboard/total/${subject}`).pipe(map((resp) => resp.data.total));
  }

  public getTimeseries(series: DashboarValidSeries, interval: DashboarValidIntervals = 'year') {
    return this.get(`/admin/v3/dashboard/timeseries/${series}/${interval}`);
  }
}
