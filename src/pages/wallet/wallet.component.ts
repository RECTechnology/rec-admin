import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

import { LoginService } from '../../services/auth/auth.service';
import { ControlesService } from '../../services/controles/controles.service';
import { UtilsService } from '../../services/utils/utils.service';
import { TransactionService } from '../../services/transactions/transactions.service';
import { TxDetails } from '../../dialogs/wallet/tx_details/tx_details.dia';
import { getDateDMY } from '../../shared/utils.fns';
import { CompanyService } from '../../services/company/company.service';
import { OnLogout, OnLogin, TablePageBase } from '../../bases/page-base';
import { ExportTxsDia } from '../../dialogs/wallet/export-txs/export-txs.dia';
import { CashOutDia } from '../../dialogs/wallet/cash-out/cash-out.dia';
import { TxFilter } from '../../components/other/filter/filter';
import Transaction from '../../shared/entities/transaction/transaction.ent';
import { AlertsService } from 'src/services/alerts/alerts.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wallet',
  styleUrls: ['../../pages/wallet/wallet.css'],
  templateUrl: '../../pages/wallet/wallet.html',
})
export class WalletComponent extends TablePageBase implements OnInit, OnDestroy, OnLogout, OnLogin {
  public pageName = 'Wallet';
  public sortID: string = 'created';
  public sortDir: string = 'desc';
  public loadingTransactions: boolean = false;
  public showClearParams: boolean = false;
  public default_currency: string = '';
  public refreshInterval: number = 25e3; // Miliseconds
  public totalWalletTransactions: number = 0;
  public transactions: any = {};
  public sortedData;
  public refreshObs;
  public filter;
  public date = moment().subtract(1, 'year').toDate();
  public datePipe = new DatePipe('es');
  public dateTo = getDateDMY(new Date(), '-');
  public dateFrom = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  public querySub: any;

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public txService: TransactionService,
    public dialog: MatDialog,
    public utils: UtilsService,
    public router: Router,
    public ls: LoginService,
    public companyService: CompanyService,
    public alerts: AlertsService,
    translateService: TranslateService,
  ) {
    super(router, translateService);
    this.filter = new TxFilter(this.router);

    // Gets the query parameters
    this.querySub = this.route.queryParams.subscribe((params) => {
      if (params) {
        for (const k in params) {
          if (k !== 'account') {
            this.filter.addFilter(k, params[k], {});
          }
        }
      }
      this.getTransactions();
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.dateFrom != null) {
        this.dateFrom = getDateDMY(new Date(params.dateFrom), '-');
      }
      if (params.dateTo != null) {
        this.dateTo = getDateDMY(new Date(params.dateTo), '-');
      }
    });
  }
  // Custom hooks
  public onLogout() {
    this.ngOnDestroy();
  }

  public onLogin() {
    this.getTransactions();
  }

  public eventClick(e) {
    this.router.navigate([`/accounts/${Number(e.target.innerHTML)}`]);
  }

  public addDateFromToQuery(event) {
    super.addToQueryParams({
      dateFrom: event + '',
    });
    this.showClearParams = true;
    this.getTransactions();
  }
  public addDateToToQuery(event) {
    this.dateTo = event;
    super.addToQueryParams({
      dateTo: this.dateTo,
    });
    this.showClearParams = true;
    this.getTransactions();
  }
  // Component Events
  public onInit() {
    this.default_currency = 'REC';
    this.filter.filterOptions.status = this.filter.statuses;
  }

  public ngOnDestroy() {
    /* Must remove any interval when component is destroyed or it will keep running */
    clearInterval(this.refreshObs);
    this.txService.dailyCustom = null;
    this.dialog.closeAll();
    this.querySub.unsubscribe();
  }

  public changedDate(dn, $event) {
    const d = $event.target.value;
    if (dn === 'from') {
      this.dateFrom = d;
    }
    if (dn === 'to') {
      this.dateTo = d;
    }
    this.getTransactions();
  }

  // Makes all api calls for wallet
  public refresh() {
    this.getTransactions();
  }

  public getTx(id) {
    return this.txService.getTxById(id);
  }

  public search() {
    this.showClearParams = true;
    if (this.filter.search.match(/[abcdef0-9]{24}/i)) {
      this.openTxDetails(this.filter.search);
    }
  }

  // Open tx details modal
  public openTxDetails(transaction) {
    const dialogRef = this.dialog.open(TxDetails);
    dialogRef.componentInstance.transaction = transaction;
    dialogRef.componentInstance.isFromAccountMovements = false;
    return dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getTransactions();
      }
    });
  }

  public sendRecs() {
    const dialogRef = this.dialog.open(CashOutDia);
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.getTransactions();
      }
    });
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = $event.pageIndex * this.limit;

    this.addToQueryParams({
      limit: this.limit,
      offset: this.offset,
    });
    this.getTransactions();
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.data.slice();
      this.sortID = 'created';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction;
    }
    this.addToQueryParams({
      sortId: this.sortID,
      sortDir: this.sortDir,
    });
    this.getTransactions();
  }

  public exportCSV() {
    const ref = this.dialog.open(ExportTxsDia);
    ref.componentInstance.dateFrom = this.dateFrom;
    ref.componentInstance.dateTo = this.dateTo;
    ref.componentInstance.filter.filterOptions = this.filter.filterOptions;
    return ref.afterClosed();
  }

  // Gets the transactions with filter data and calculates buy/sell price if its an exchange
  public async getTransactions() {
    this.loading = true;
    this.loadingTransactions = true;

    this.txService
      .listTx(this.filter.search, this.offset, this.limit, this.sortID, this.sortDir, this.dateFrom, this.dateTo)
      .subscribe((resp) => {
        this.transactions = resp.data.list;
        this.totalWalletTransactions = resp.data.total;
        this.txService.walletTransactions = this.transactions;
        this.sortedData = this.txService.walletTransactions.slice();
        this.loadingTransactions = false;
        this.loading = false;
      });
  }

  public createModal(component: any, data = {}): any {
    let dialogRef: any = this.dialog.open(component);
    dialogRef.componentInstance.setReference(dialogRef);

    for (const key in data) {
      if (key) {
        dialogRef.componentInstance[key] = data[key];
      }
    }
    if ('walletComponent' in dialogRef.componentInstance) {
      dialogRef.componentInstance.walletComponent = this as never;
    }
    if ('dialog' in dialogRef.componentInstance) {
      dialogRef.componentInstance.dialog = this.dialog as never;
    }
    dialogRef.afterClosed().subscribe((resp) => {
      dialogRef = null;
      this.getTransactions();
    });

    return {
      afterClosed: (x) => dialogRef.afterClosed(),
      instance: dialogRef.componentInstance,
    };
  }

  public clearQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        dateTo: null,
        dateFrom: null,
      },
      queryParamsHandling: 'merge',
    });
    this.dateFrom = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.dateTo = getDateDMY(new Date(), '-');
    this.filter.search = '';
    this.getTransactions();
    this.showClearParams = false;
  }
}
