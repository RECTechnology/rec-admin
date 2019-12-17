import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {
  TlHeader, TlItemOption, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';

import * as moment from 'moment';
import { UtilsService } from 'src/services/utils/utils.service';

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

const LW_ERROR_MONEY_OUT = {
  0: 'successful',
  3: 'money-out successful',
  4: 'error',
};

const LW_ERROR_P2P = {
  0: 'pending payment',
  3: 'payment successful and terminated',
  4: 'error',
};

const processLwTx = (res) => {
  // F*** lemonway man!
  const parts = res.DATE.split('/');
  const temp = parts[0];
  parts[0] = parts[1];
  parts[1] = temp;

  res.DATE = parts.join('/');

  return res;
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
      sort: 'ID',
      title: 'ID',
      type: 'code',
    }, {
      sort: 'CRED',
      title: 'Amount',
      type: 'number',
      suffix: '€',
      accessor: (el) => {
        return el.CRED;
      },
      statusClass(value) {
        return 'col-error';
      },
    }, {
      sort: 'TYPE',
      title: 'Status',
      type: 'code',
      tooltip(el) {
        return el.status_text + ' (' + el.STATUS + ')';
      },
    }, {
      sort: 'DATE',
      title: 'Date',
      type: 'date',
    }, {
      sort: 'MSG',
      title: 'Concept',
    },
  ];
  public headersP2P: TlHeader[] = [
    {
      sort: 'ID',
      title: 'ID',
      type: 'code',
    }, {
      sort: 'DEB',
      title: 'Amount',
      type: 'number',
      suffix: '€',
      accessor: (el) => {
        return el.DEB;
      },
      statusClass(el) {
        return el < 0 ? 'col-error' : '';
      },
    }, {
      sort: 'SEN',
      title: 'Envia',
    }, {
      sort: 'REC',
      title: 'Recibe',
    }, {
      sort: 'STATUS',
      title: 'Status',
      type: 'code',
      tooltip(el) {
        return el.status_text + ' (' + el.INT_STATUS + ')';
      },
    }, {
      sort: 'DATE',
      title: 'Date',
      type: 'date',
    }, {
      sort: 'MSG',
      title: 'Concept',
    },
  ];
  public tableOptions: Partial<TableListOptions> = {
    sortEnabled: false,
  };

  public WALLET_STATUS_MAP = WALLET_STATUS_MAP;
  public currentTab = 0;

  public tabMap = {
    withdrawals: 0,
    wallet2wallet: 1,
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
  ) { super(); }

  public ngOnInit() {
    this.loading = true;
    this.accCrud.lwGetWallet(this.id)
      .subscribe((resp) => {
        this.lwInfo = resp.data;
        this.getP2PTxs();
        this.getMoneyTxs();
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

  public newWithdrawal() {
    const dialog = this.alerts.createModal(CreateLemonWithdrawalDia, {
      id: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }

  public getP2PTxs() {
    this.accCrud.lwGetP2PList([this.lwInfo.ID])
      .subscribe((resp) => {
        this.total = resp.data.COUNT;
        this.sortedDataP2P = resp.data.TRANS.reverse()
          .map(processLwTx)
          .map((el) => {
            el.status_text = LW_ERROR_P2P[el.STATUS];
            el.isOut = el.SEN === this.lwInfo.ID;
            if (el.isOut) {
              el.CRED = -Number(el.CRED);
            }
            if (el.isOut) {
              el.DEB = -Number(el.DEB);
            }
            return el;
          });
      });
  }

  public getMoneyTxs() {
    this.accCrud.lwGetMoneyTxList([this.lwInfo.ID])
      .subscribe((resp) => {
        this.total = resp.data.COUNT;
        this.sortedData = resp.data.TRANS
          .map(processLwTx)
          .map((el) => {
            el.status_text = LW_ERROR_MONEY_OUT[el.INT_STATUS];
            return el;
          });
      });
  }

  public newWallet2WalletOut() {
    const dialog = this.alerts.createModal(CreateLemonWallet2WalletOutDia, {
      originAccountId: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }
}
