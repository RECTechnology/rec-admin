import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { CurrenciesService } from '../../services/currencies/currencies.service';
import { ControlesService } from '../../services/controles/controles.service';
import { CompanyService } from '../../services/company/company.service';
import { TransactionService } from '../../services/transactions/transactions.service';
import { UtilsService } from '../../services/utils/utils.service';
import { LoginService } from '../../services/auth.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { PageBase, OnLogout } from '../../bases/page-base';
import { AppService } from '../../services/app.service';

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
  private refreshInterval: number = 60e3; // Miliseconds
  private refreshObs: any;

  constructor(
    public titleService: Title,
    private us: UserService,
    public controles: ControlesService,
    private currenciesService: CurrenciesService,
    private transactions: TransactionService,
    private dialog: MatDialog,
    private utils: UtilsService,
    public app: AppService,
    private ws: WalletService,
    public ls: LoginService,
    private companyService: CompanyService,
  ) {
    super();
  }

  // Custom hooks
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

  // Component hooks
  public ngOnDestroy() {
    /* Must remove any interval when component is destroyed or it will keep running */
    clearInterval(this.refreshObs);
    this.dialog.closeAll();
  }

  /**
  * Set a interval every this.refreshInterval
  */
  private setRefresh(): void {
    this.refreshObs = setInterval((_) => {
      this.getStatus();
    }, this.refreshInterval);
  }
}
