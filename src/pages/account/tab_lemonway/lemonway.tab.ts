import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TlHeader, TlItemOption, TableListOptions } from 'src/components/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CreateLemonWithdrawalDia } from 'src/dialogs/create-lemon-withdrawal/create-lemon-withdrawal.dia';
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

  constructor(
    public controles: ControlesService,
    public router: Router,
    public ls: LoginService,
    public titleService: Title,
    public alerts: AlertsService,
    public accCrud: AccountsCrud,
  ) { super(); }

  public ngOnInit() {
    this.accCrud.lwGetWallet(this.id)
      .subscribe((resp) => {
        this.lwInfo = resp.data;
        console.log('LW', resp);
      });
    super.ngOnInit();
  }

  public search() {
    return;
  }

  public newWithdrawal() {
    const dialog = this.alerts.createModal(CreateLemonWithdrawalDia, {
      id: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }
}
