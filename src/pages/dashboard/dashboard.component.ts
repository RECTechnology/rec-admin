import { Component, OnDestroy } from '@angular/core';
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

declare const Morris;

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.css'],
  templateUrl: './dashboard.html',
})
export class DashboardComponent extends PageBase implements OnDestroy, OnLogout {
  public pageName = 'Dashboard';
  public statusMask = {
    bnode: false,
    nrdb: false,
    rdb: false,
  };
  public exceptions: string[];
  public loadingStatus = false;
  public totalCompanies: Observable<number>;
  public totalPrivates: Observable<number>;
  public totalTransactions: Observable<number>;
  public totalBalance: Observable<number>;
  public registerTimeseries: any[];
  public transactionsTimeseries: any[];

  public txColors = ['#e05206', '#de8657'];

  private refreshInterval: number = 60e3; // Miliseconds
  private refreshObs: any;

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

    this.totalCompanies = dashService.getStatistics('company');
    this.totalPrivates = dashService.getStatistics('private');
    this.totalTransactions = dashService.getStatistics('transactions');
    this.totalBalance = dashService.getStatistics('balance');

    this.getRegisterTS('year');
    this.getTransactionsTS('year');
  }

  public getRegisterTS(interval: DashboardValidIntervals) {
    this.dashService.getTimeseries('registers', interval).subscribe((resp) => {
      console.log(resp);
      this.registerTimeseries = resp.data;
    });
  }

  public getTransactionsTS(interval: DashboardValidIntervals) {
    this.dashService.getTimeseries('transactions', interval).subscribe((resp) => {
      this.transactionsTimeseries = resp.data;
    });
  }

  public onLogout() {
    this.ngOnDestroy();
  }

  public afterContentInit() {
    this.getStatus();
    this.setRefresh();

    const donut = new Morris.Donut({
      colors: ['#0098db', '#9ed7f1', '#e05206', '#f0ab87', '#0555a5'],
      data: [
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

  private setRefresh(): void {
    this.refreshObs = setInterval((_) => {
      this.getStatus();
    }, this.refreshInterval);
  }
}
