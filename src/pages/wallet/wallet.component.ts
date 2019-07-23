import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth.service';
import { CurrenciesService } from '../../services/currencies/currencies.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { ControlesService } from '../../services/controles/controles.service';
import { UtilsService } from '../../services/utils/utils.service';
import { TransactionService } from '../../services/transactions/transactions.service';
import { AddCommentDia } from './dialogs/add_comment/add_comment.dia';
import { TxDetails } from './dialogs/tx_details/tx_details.dia';
import { TranslateService } from '@ngx-translate/core';
import { getDateDMY } from '../../shared/utils.fns';
import { CompanyService } from '../../services/company/company.service';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { PageBase, OnLogout, OnLogin } from '../../bases/page-base';
import { Ticker } from '../../shared/entities/ticker/ticker';
import { ExportTxsDia } from './dialogs/export-txs/export-txs.dia';
import { CashOutDia } from './dialogs/cash-out/cash-out.dia';
import { TxFilter } from '../../components/filter/filter';
import { CashOutTesoroDia } from './dialogs/cash-out-tesoro/cash-out-tesoro.dia';
import Transaction from '../../shared/entities/transaction/transaction.ent';

@Component({
  selector: 'wallet',
  styleUrls: [
    '../../pages/wallet/wallet.css',
  ],
  templateUrl: '../../pages/wallet/wallet.html',
})
export class WalletComponent extends PageBase implements OnInit, OnDestroy, OnLogout, OnLogin {

  public pageName = 'Wallet';
  public showActions = false;
  public accountToView = null;

  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public currencies: any[] = [];
  public notUsedMethods: any[] = [];
  public cryptoCurrencies: any[] = ['CREA', 'ETH', 'BTC', 'FAIR', 'FAC'];
  public cash_in_methods: any[] = [];
  public cash_out_methods: any[] = [];
  public exchange_methods: any[] = [];
  public wallet2wallet_methods: any[] = [];
  public loadingTransactions: boolean = false;
  public reloadingCurrency: boolean = false;
  public showZeroBalances: boolean = localStorage.getItem('showZeroBalances') === 'hide' ? false : true;
  public default_currency: string = '';
  public refreshInterval: number = 25e3; // Miliseconds
  public totalWalletTransactions: number = 0;
  public transactions: any = {};
  public sortedData;
  public refreshObs;
  public filter;
  public userFavs = [];
  public dateTo = getDateDMY(new Date(), '-');
  public dateFrom = getDateDMY(new Date(Date.now() - (30 * 2 * 24 * 60 * 60 * 1000 * 4)), '-');
  public querySub: any;

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public router: Router,

    public controles: ControlesService,
    public us: UserService,
    public txService: TransactionService,
    public currenciesService: CurrenciesService,
    public dialog: MatDialog,
    public ws: WalletService,
    public utils: UtilsService,
    public ls: LoginService,
    public translate: TranslateService,
    public companyService: CompanyService,
    public snackbar: MySnackBarSevice,
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
            } else {
              this.accountToView = params[k];
            }
          }
        }
        this.getTransactions();
        this.getMethods();
        this.companyService.doGetCompanies();
      });
  }

  public changeAccount(account) {
    this.accountToView = account.company.id;
    this.router.navigate(['/transactions'], {
      queryParams: { account: account.company.id },
      queryParamsHandling: 'merge',
    });
    this.getTransactions();
  }

  // Custom hooks
  public onLogout() {
    this.ws.userFavs = [];
    this.ngOnDestroy();
  }

  public onLogin() {
    this.ws.userFavs = JSON.parse(localStorage.getItem('user-favs') || '[]');
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
    // this.getCurrencies();
    this.setRefresh();
    this.getMethods();
    this.getTickers();
    this.getTransactions();
  }

  // Called when user clicks show/hide zero balances
  public showZeroBalanceChanged() {
    localStorage.setItem('showZeroBalances', this.showZeroBalances ? 'show' : 'hide');
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
        this.snackbar.open('Error finding transaction: ' + error, 'ok');
      });

  }

  // Open add comment
  public openAddComment(transaction): void {
    this.createModal(AddCommentDia, { transaction });
  }

  public openCashOut() {
    this.createModal(CashOutDia, {});
  }

  public sendRecs() {
    const dialogRef = this.dialog.open(CashOutDia);
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.getTransactions();
      }
    });
  }

  public openCashOutTesoro() {
    this.createModal(CashOutTesoroDia, {});
  }

  public sortData(sort: Sort): void {
    const data = this.txService.walletTransactions.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.sortID = 'id';
      this.sortDir ='desc';
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

  // This is to bypass webpack throwing errors if using dinamic image naming, ie: src="img/images/{{imgname}}.png"
  // As 'img/images/{{imgname}}.png' is not a valid image path until rendered by angular
  public getImage(type) {
    return `../../resources/img/${type}.png`;
  }

  public getCurrencySmallImage(curr) {
    return `../../resources/currencies/${curr}-small.png`;
  }

  /**
   * @param {String} currency - The currency to set as default
   */
  public changeCurrency(currency: string): void {
    this.reloadingCurrency = true;
    this.currenciesService.updateCurrency(currency)
      .subscribe((resp) => {
        localStorage.removeItem('wallet_balance');
        this.us.userData.group_data = resp.data;
        this.default_currency = this.us.getDefaultCurrency();
        this.ws.doGetWallets();
        this.reloadingCurrency = false;
      });
  }

  // Gets tickers for default currency
  public getTickers(): void {
    this.currenciesService.getTickers(this.us.getDefaultCurrency())
      .subscribe((resp) => {
        const tickers = resp.data;
        for (const key of tickers) {
          const [currIn, currOut] = key.split('x');
          this.currenciesService.tickers[key] = new Ticker(key, tickers[key], currIn, currOut, 1);
        }
      }, (error) => { return; });
  }

  // Gets methods and filters them by 'in' or 'out', also sets methods_in/out filters
  public getMethods(): void {
    this.filter.filterOptions.methods_in = ['rec', 'eur'];
    this.filter.filterOptions.methods_out = ['rec', 'eur'];
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

  // Refreshes data each 'this.refreshInterval'
  public setRefresh(): void {
    // this.refreshObs = setInterval(_ => {
    //   this.getTickers();
    // }, this.refreshInterval);
  }

  /**
   * Creates and shows a modal, with component as Component
   * @param { any } component - A angular component
   * @param { Object } data - Properties to override in the component
   * @returns { afterClose: Observable, instance: Component instance}
  */
  public createModal(component: any, data = {}): any {
    let dialogRef: any = this.dialog.open(component);
    dialogRef.componentInstance.setReference(dialogRef);

    for (const key in data) {
      if (key) {
        dialogRef.componentInstance[key] = data[key];
      }
    }
    if ('walletComponent' in dialogRef.componentInstance) {
      // tslint:disable-next-line
      dialogRef.componentInstance['walletComponent'] = (this as never);
    }
    if ('dialog' in dialogRef.componentInstance) {
      dialogRef.componentInstance.dialog = (this.dialog as never);
    }
    dialogRef.afterClosed().subscribe((resp) => {
      dialogRef = null;
      this.ws.doGetWallets();
      this.getTransactions();
    });

    return {
      afterClosed: (x) => {
        return dialogRef.afterClosed();
      },
      instance: dialogRef.componentInstance,
    };
  }
}
