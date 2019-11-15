import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TlHeader, TlItemOption, TableListOptions } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { CreateLemonWallet2WalletInDia } from 'src/dialogs/lemonway/create-lemonway-w2w-in/create-lemon-w2w-in.dia';

import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';

const WALLET_STATUS_MAP = {
  '-1': 'wallet SC',
  '1': 'Account not opened',
  '2': 'registered, KYC incomplete',
  '3': 'registered, rejected KYC',
  '5': 'registered, KYC 1 (status given at registration)',
  '6': 'registered, KYC 2',
  '7': 'registered, KYC 3',
  '8': 'registered, expired KYC',
  '10': 'blocked',
  '12': 'closed',
  '13': 'registered, status is being updated from KYC 2 to KYC 3',
  '14': 'one-time customer',
  '15': 'special wallet for crowdlending',
  '16': 'wallet technique',
};

@Component({
  selector: 'lemonway-tab',
  templateUrl: './lemonway.html',
})
export class LemonWayTab extends TablePageBase {
  @Input() public id = '';

  public withdrawals = [];
  public lwInfo: any = {};
  public pageName = 'Lemonway';
  public loading = true;
  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
      type: 'code',
    }, {
      sort: 'concept',
      title: 'Concept',
      type: 'text',
    }, {
      sort: 'amount',
      title: 'Amount',
      type: 'code',
    },
  ];
  public itemOptions: TlItemOption[] = [
    {
      callback: () => { },
      text: 'Edit',
      icon: 'fa-edit',
      ngIf: (item) => {
        return item.status !== 'processed';
      },
    },
    {
      callback: () => { },
      text: 'View',
      icon: 'fa-eye',
      ngIf: (item) => {
        return item.status === 'processed';
      },
    },
  ];
  public options: TableListOptions = {
    optionsType: 'buttons',
  };

  public WALLET_STATUS_MAP = WALLET_STATUS_MAP;
  public currentTab = 0;

  public tabMap = {
    withdrawals: 0,
    wallet2wallet: 1,
    0: 'withdrawals',
    1: 'wallet2wallet',
  };

  constructor(
    public controles: ControlesService,
    public router: Router,
    public ls: LoginService,
    public titleService: Title,
    public alerts: AlertsService,
    public accCrud: AccountsCrud,
    public route: ActivatedRoute,
  ) { super(); }

  public ngOnInit() {
    this.accCrud.lwGetWallet(this.id)
      .subscribe((resp) => {
        this.lwInfo = resp.data;
        console.log('LW', resp);
      });

    this.route.queryParams
      .subscribe((params) => {
        const tab = params.ltab || 'withdrawals';
        this.currentTab = this.tabMap[tab] || 0;
      });

    super.ngOnInit();
  }

  public search() {
    return;
  }

  public changeUrl($event) {
    if (this.id) {
      this.router.navigate(['/accounts/' + this.id], {
        queryParams: { ltab: this.tabMap[$event] },
        queryParamsHandling: 'merge',
      });
    }
  }

  public newWithdrawal() {
    const dialog = this.alerts.createModal(CreateLemonWithdrawalDia, {
      id: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }

  public newWallet2WalletOut() {
    const dialog = this.alerts.createModal(CreateLemonWallet2WalletOutDia, {
      id: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }

  public newWallet2WalletIn() {
    const dialog = this.alerts.createModal(CreateLemonWallet2WalletInDia, {
      id: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }
}
