import { Component, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, Sort } from '@angular/material';
import * as moment from 'moment';

import { ControlesService } from 'src/services/controles/controles.service';
import { TxFilter } from 'src/components/filter/filter';
import { TransactionService } from 'src/services/transactions/transactions.service';
import { TxDetails } from 'src/pages/wallet/dialogs/tx_details/tx_details.dia';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/services/utils/utils.service';
import { CashOutDia } from 'src/pages/wallet/dialogs/cash-out/cash-out.dia';
import { getDateDMY } from 'src/shared/utils.fns';
import { ExportTxsDia } from 'src/pages/wallet/dialogs/export-txs/export-txs.dia';

@Component({
  selector: 'movements-tab',
  styleUrls: ['./tab_movements.css'],
  templateUrl: './tab_movements.html',
})
export class MovementsTab implements AfterContentInit {
  public loading = false;
  public searchQuery = '';
  public offset = 0;
  public limit = 10;
  public showingAccounts = 0;
  public totalMovements = 0;
  public sortedData = [];
  public elements = [];
  public filter: TxFilter;
  public account_id: string;
  public Brand: any = environment.Brand;
  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public dateTo = getDateDMY(new Date(), '-');
  public dateFrom = getDateDMY(new Date(Date.now() - (30 * 2 * 24 * 60 * 60 * 1000 * 4)), '-');

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public txService: TransactionService,
    public router: Router,
    public controles: ControlesService,
    public utils: UtilsService,
  ) {
    this.route.params.subscribe((params) => {
      this.account_id = params.id;

      this.filter = new TxFilter(this.router, '/account/' + this.account_id);
      this.filter.reloader = this.search.bind(this); // Call for when filter changes

      this.search();
    });
  }

  public ngAfterContentInit() {
    this.loading = true;
  }

  // Open tx details modal
  public openTxDetails(transaction) {
    const dialogRef = this.dialog.open(TxDetails);
    dialogRef.componentInstance.transaction = transaction;
    return dialogRef.afterClosed();
  }

  public search() {
    this.txService.getTxForAccount(
      this.account_id, this.offset,
      this.limit, this.dateFrom,
      this.dateTo, this.sortID, this.sortDir,
    ).subscribe(
      (resp) => {
        this.loading = false;
        this.elements = resp.data.elements;
        this.totalMovements = resp.data.total;
        this.sortedData = this.elements.slice();
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  public sendRecs() {
    const dialogRef = this.dialog.open(CashOutDia);
    dialogRef.componentInstance.tx.receiver = '';
    dialogRef.componentInstance.tx.sender = this.account_id;
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.search();
      }
    });
  }

  public exportCSV() {
    const ref = this.dialog.open(ExportTxsDia);
    ref.componentInstance.dateFrom = this.dateFrom;
    ref.componentInstance.dateTo = this.dateTo;
    ref.componentInstance.filter.filterOptions = this.filter.filterOptions;

    const accountID = this.account_id;

    // tslint:disable-next-line: space-before-function-paren
    ref.componentInstance.getTransactions = (function () {
      this.loading = true;
      this.txService.getTxForAccount(
        accountID, this.offset,
        this.limit, this.dateFrom,
        this.dateTo, this.sortID, this.sortDir,
      ).subscribe(async (resp) => {
        this.data = resp.data.elements.map((el) => {
          const created = moment(el.created);
          el.created = created.format();

          const updated = moment(el.updated);
          el.updated = updated.format();
          return el;
        });
        this.foundTxs = this.data.length;
        this.loading = false;
        this.preview = this.getFormatted(this.data);
      });
    }).bind(ref.componentInstance);

    ref.afterClosed().subscribe((resp) => {
    });
  }

  public sortData(sort: Sort): void {
    const data = this.elements.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortID = sort.active;
    this.sortDir = sort.direction.toUpperCase();
    this.search();
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);

    this.search();
  }

  public trackByFn(i) {
    return i;
  }
}
