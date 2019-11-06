import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ControlesService } from '../../services/controles/controles.service';
import { LoginService } from '../../services/auth/auth.service';
import { PageBase, OnLogout } from '../../bases/page-base';
import { AppService } from '../../services/app/app.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { CompanyService } from 'src/services/company/company.service';
import { Observable } from 'rxjs';
import { TransactionService } from 'src/services/transactions/transactions.service';
import { DashboardService, DashboardValidIntervals } from 'src/services/dashboard/dashboard.service';
import { DashChart } from 'src/components/dash-chart/dash-chart.component';
import { map } from 'rxjs/operators';

declare const Morris;

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.css'],
  templateUrl: './dashboard.html',
})
export class DashboardComponent extends PageBase implements OnDestroy, OnLogout {
  public pageName = 'Dashboard';
  public statusMask = { bnode: false, nrdb: false, rdb: false };
  public exceptions: string[];
  public neighbourhoods: any[] = [];
  public loadingStatus = false;
  public totalCompanies: Observable<number>;
  public totalPrivates: Observable<number>;
  public totalTransactions: Observable<number>;
  public totalBalance: Observable<number>;
  public registerTimeseries: any[] = [];
  public transactionsTimeseries: any[] = [];

  @ViewChild('registerChart', { static: false }) public registerChart: DashChart;
  @ViewChild('txChart', { static: false }) public txChart: DashChart;

  public txColors = ['#e05206', '#de8657'];
  public regColors = ['#0098db', '#de8657'];
  public neighColors = ['#0098db', '#9ed7f1', '#e05206', '#f0ab87', '#0555a5'];
  public refreshInterval: number = 60; // Miliseconds
  public refreshObs: any;
  public refreshEnabled = true;

  constructor(
    public titleService: Title,
    public controles: ControlesService,
    private dialog: MatDialog,
    public app: AppService,
    public ls: LoginService,
    public crudAccounts: AccountsCrud,
    public companyService: CompanyService,
    public tx: TransactionService,
    public dashService: DashboardService,
  ) {
    super();
  }

  public ngAfterViewInit() {
    this.setRefresh();
    this.getAggregations();
    this.getNeighbourhoods();
    this.getStatus();
    this.getRegisterTS(this.registerChart.selectedTimeframe.value);
    this.getTransactionsTS(this.txChart.selectedTimeframe.value);
  }

  public getAggregations() {
    this.totalCompanies = this.dashService.getStatistics('company');
    this.totalPrivates = this.dashService.getStatistics('private');
    this.totalTransactions = this.dashService.getStatistics('transaction');
    this.totalBalance = this.dashService.getStatistics('balance').pipe(map((total) => total / 1e8));
  }

  public getNeighbourhoods() {
    this.dashService.getNeighbourhoodStatistics().subscribe((resp) => {
      console.log(resp);
      this.neighbourhoods = resp.data;
      this.updateDonutChart(resp.data.map((el) => ({
        label: el.name,
        value: Number(el.accounts_total),
      })));
    });
  }

  public updateDonutChart(data?) {
    document.getElementById('donut').innerHTML = '';
    const donut = new Morris.Donut({
      colors: ['#0098db', '#9ed7f1', '#e05206', '#f0ab87', '#0555a5'],
      data: data || [
        { label: 'Barrio 1', value: 12 },
        { label: 'Barrio 2', value: 30 },
        { label: 'Barrio 3', value: 20 },
        { label: 'Barrio 4', value: 56 },
        { label: 'Barrio 5', value: 122 },
      ],
      element: 'donut',
    });

    (window as any).addEventListener('resize', () => {
      donut.redraw();
    });
  }

  public onLogout() {
    this.ngOnDestroy();
  }

  public getRegisterTS(interval: DashboardValidIntervals) {
    this.dashService.getTimeseries('registers', interval).subscribe((resp) => {
      this.registerTimeseries = resp.data.map((el) => {
        return { d: el.label, a: el.private || 0, b: el.company || 0 };
      });
      this.registerChart.update(this.registerTimeseries);
    });
  }

  public getTransactionsTS(interval: DashboardValidIntervals) {
    this.dashService.getTimeseries('transactions', interval).subscribe((resp) => {
      console.log('sadasdas', resp);
      this.transactionsTimeseries = resp.data.map((el) => {
        return { d: el.label, a: el.count || 0, b: el.volume / 1e8 || 0 };
      });
      this.txChart.update(this.transactionsTimeseries);
    });
  }

  public getStatus() {
    this.loadingStatus = true;
    this.app.getStatus()
      .subscribe((resp) => {
        this.exceptions = (resp.exceptions || []).join('\n');

        let mask = resp.system_status.toString(2);
        mask = ('0'.repeat(3 - mask.length) + mask).split('');

        this.statusMask = {
          bnode: mask[0] === '1',
          nrdb: mask[1] === '1',
          rdb: mask[2] === '1',
        };

        this.loadingStatus = false;
      }, (error) => {
        this.loadingStatus = false;
      });
  }

  public ngOnDestroy() {
    clearInterval(this.refreshObs);
    this.dialog.closeAll();
  }

  public refreshChanged($evt) {
    this.refreshEnabled = $evt.checked;
    this.setRefresh();
  }

  public setRefresh(): void {
    console.log('setRefresh', this.refreshEnabled);
    console.log('refreshInterval', this.refreshInterval);
    if (this.refreshEnabled) {
      this.refreshObs = setInterval((_) => {
        this.getStatus();
        this.getRegisterTS(this.registerChart.selectedTimeframe.value);
        this.getTransactionsTS(this.txChart.selectedTimeframe.value);
        this.getAggregations();
      }, Number(this.refreshInterval) * 1000);
    } else {
      clearInterval(this.refreshObs);
    }
  }
}
