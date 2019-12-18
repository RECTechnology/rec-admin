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
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { UtilsService } from 'src/services/utils/utils.service';
import {
  LW_ERROR_P2P, processLwTx,
} from 'src/data/lw-constants';

@Component({
  selector: 'lw-w2w-tab',
  templateUrl: './wallet-to-wallet.html',
})
export class LwTabWalletToWallet extends TablePageBase {
  @Input() public id = '';

  public withdrawals = [];
  public lwInfo: any = {};
  public pageName = 'Lemonway';
  public loading = true;
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
        this.loading = false;
      }, (err) => {
        if (err.errors) {
          this.error = UtilsService.normalizeLwError(err.errors).pop();
        }
        this.loading = false;
      });
    super.ngOnInit();
  }

  public search() {
    return;
  }

  public getP2PTxs() {
    this.loading = true;
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
        this.loading = false;
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
