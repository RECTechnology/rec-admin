import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ControlesService } from '../../services/controles/controles.service';
import { LoginService } from '../../services/auth/auth.service';
import { PageBase, OnLogout } from '../../bases/page-base';
import { AppService } from '../../services/app/app.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { CompanyService } from 'src/services/company/company.service';
import { TransactionService } from 'src/services/transactions/transactions.service';
import { DashboardService, DashboardValidIntervals } from 'src/services/dashboard/dashboard.service';
import { DashChart } from 'src/components/ui/dash-chart/dash-chart.component';
import { map } from 'rxjs/internal/operators/map';

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
  public totalCompanies: number;
  public totalPrivates: number;
  public totalTransactions: number;
  public totalBalance: number;
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

  public async getAggregations() {
    this.totalCompanies = await this.dashService.getStatistics('company').toPromise();
    this.totalPrivates = await this.dashService.getStatistics('private').toPromise();
    this.totalTransactions = await this.dashService.getStatistics('transaction').toPromise();
    this.totalBalance = await this.dashService.getStatistics('balance')
      .pipe(map((total) => total / 1e8)).toPromise();
  }

  public getNeighbourhoods() {
    this.dashService.getNeighbourhoodStatistics().subscribe((resp) => {
      this.neighbourhoods = resp.data.sort((a, b) => a.accounts_total - b.accounts_total);
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
      const dataPrivate = [];
      const dataCompany = [];
      resp.data = resp.data.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      for (const point of resp.data) {
        dataPrivate.push({ x: new Date(point.time).getTime(), y: +point.private || 0 });
        dataCompany.push({ x: new Date(point.time).getTime(), y: +point.company || 0 });
      }
      this.registerChart.update(dataPrivate, dataCompany);
    });
  }

  public getTransactionsTS(interval: DashboardValidIntervals) {
    this.dashService.getTimeseries('transactions', interval).subscribe((resp) => {
      const txCount = [];
      const txVolume = [];
      resp.data = resp.data.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      for (const point of resp.data) {
        txCount.push({ x: new Date(point.time).getTime(), y: point.count || 0 });
        txVolume.push({ x: new Date(point.time).getTime(), y: point.volume / 1e8 || 0 });
      }
      this.txChart.update(txCount, txVolume);
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
