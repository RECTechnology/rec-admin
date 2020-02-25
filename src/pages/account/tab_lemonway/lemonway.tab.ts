import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {
  TlHeader, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { UtilsService } from 'src/services/utils/utils.service';
import {
  WALLET_STATUS_MAP, IBAN_STATUS_MAP,
  LW_ERROR_P2P, LW_ERROR_MONEY_OUT, processLwTx,
} from 'src/data/lw-constants';
import { EventsService } from 'src/services/events/events.service';
import { AddIbanDia } from 'src/dialogs/entities/add-iban/add-iban.dia';

@Component({
  selector: 'lemonway-tab',
  templateUrl: './lemonway.html',
})
export class LemonWayTab extends TablePageBase {
  @Input() public id = '';

  public lwInfo: any = null;
  public pageName = 'Lemonway';
  public loading = true;
  public WALLET_STATUS_MAP = WALLET_STATUS_MAP;
  public IBAN_STATUS_MAP = IBAN_STATUS_MAP;
  public currentTab = 0;

  public tabMap = {
    // ibans: 0,
    withdrawals: 0,
    wallet2wallet: 1,
    // 0: 'ibans',
    0: 'withdrawals',
    1: 'wallet2wallet',
  };
  public sortedDataP2P: any = [];
  public error = null;

  constructor(
    public controles: ControlesService,
    public router: Router,
    public ls: LoginService,
    public titleService: Title,
    public alerts: AlertsService,
    public accCrud: AccountsCrud,
    public route: ActivatedRoute,
    public events: EventsService,
  ) { super(); }

  public ngOnInit() {
    this.loading = true;
    this.accCrud.lwGetWallet(this.id)
      .subscribe((resp) => {
        this.lwInfo = resp.data;
        this.loading = false;
      }, (err) => {
        if (err.errors) {
          this.error = UtilsService.normalizeLwError(err.errors).pop();
        }
        this.loading = false;
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

  public newIBAN() {
    return this.alerts.openModal(AddIbanDia, {
      id: this.id,
    }).subscribe((resp) => {
      this.search();
    });
  }

  public newWithdrawal() {
    this.currentTab = 1;
    this.events.fireEvent('cash-out:new');
  }

  public newWallet2WalletOut() {
    this.currentTab = 2;
    this.events.fireEvent('w2w:new');
  }

  public newIban() {
    this.currentTab = 0;
    this.events.fireEvent('ibans:new');
  }
}
