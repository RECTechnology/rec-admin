import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material';

import { LoginService } from '../../services/auth/auth.service';
import { ControlesService } from '../../services/controles/controles.service';
import { UtilsService } from '../../services/utils/utils.service';
import { TransactionService } from '../../services/transactions/transactions.service';
import { AddCommentDia } from '../../dialogs/wallet/add_comment/add_comment.dia';
import { TxDetails } from '../../dialogs/wallet/tx_details/tx_details.dia';
import { getDateDMY } from '../../shared/utils.fns';
import { CompanyService } from '../../services/company/company.service';
import { PageBase, OnLogout, OnLogin } from '../../bases/page-base';
import { ExportTxsDia } from '../../dialogs/wallet/export-txs/export-txs.dia';
import { CashOutDia } from '../../dialogs/wallet/cash-out/cash-out.dia';
import { TxFilter } from '../../components/other/filter/filter';
import { CashOutTesoroDia } from '../../dialogs/wallet/cash-out-tesoro/cash-out-tesoro.dia';
import Transaction from '../../shared/entities/transaction/transaction.ent';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'wallet',
  styleUrls: [
    '../../pages/wallet/wallet.css',
  ],
  templateUrl: '../../pages/wallet/wallet.html',
})
export class WalletComponent extends PageBase implements OnInit, OnDestroy, OnLogout, OnLogin {
  public pageName = 'Wallet';
  public sortID: string = 'id';
  public sortDir: string = 'desc';

  public loadingTransactions: boolean = false;
  public default_currency: string = '';
  public refreshInterval: number = 25e3; // Miliseconds
  public totalWalletTransactions: number = 0;
  public transactions: any = {};
  public sortedData;
  public refreshObs;
  public filter;
  public dateTo = getDateDMY(new Date(), '-');
  public dateFrom = getDateDMY(new Date(Date.now() - (30 * 2 * 24 * 60 * 60 * 1000 * 4)), '-');
  public querySub: any;

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public txService: TransactionService,
    public dialog: MatDialog,
    public utils: UtilsService,
    public ls: LoginService,
    public companyService: CompanyService,
    public alerts: AlertsService,
  ) {
    super();
    this.filter = new TxFilter(this.router);
    this.filter.reloader = this.getTransactions.bind(this); // Call for when filter changes

    // Gets the query parameters
    this.querySub = this.route.queryParams
      .subscribe((params) => {
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

  // Custom hooks
  public onLogout() {
    this.ngOnDestroy();
  }

  public onLogin() {
    this.getTransactions();
  }

  // Component Events
  public onInit() {
    this.default_currency = 'REC';
    this.sortedData = this.txService.walletTransactions.slice();
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
    if (dn === 'from') { this.dateFrom = d; }
    if (dn === 'to') { this.dateTo = d; }
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
    if (this.filter.search.match(/[abcdef0-9]{24}/i)) {
      this.openTxDetails(this.filter.search);
    }
  }

  // Open tx details modal
  public openTxDetails(id): void {
    this.getTx(id)
      .subscribe((resp: Transaction) => {
        this.createModal(TxDetails, {
          transaction: resp,
        });
      }, (error) => {
        this.alerts.showSnackbar('Error finding transaction: ' + error, 'ok');
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

  public sortData(sort: Sort): void {
    const data = this.txService.walletTransactions.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.sortID = 'id';
      this.sortDir = 'desc';
      return;
    }

    this.sortID = sort.active;
    this.sortDir = sort.direction.toUpperCase();
    this.getTransactions();
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
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

    this.txService.listTx(
      this.filter.searchQuery, this.offset,
      this.limit, this.sortID, this.sortDir,
      this.dateFrom, this.dateTo,
    ).subscribe((resp) => {
      this.transactions = resp.data;
      this.totalWalletTransactions = resp.total;
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
      dialogRef.componentInstance['walletComponent'] = (this as never);
    }
    if ('dialog' in dialogRef.componentInstance) {
      dialogRef.componentInstance.dialog = (this.dialog as never);
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
}
