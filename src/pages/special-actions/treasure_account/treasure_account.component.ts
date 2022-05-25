import { Component, AfterContentInit } from '@angular/core';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { AdminService } from '../../../services/admin/admin.service';
import {
  TlItemOption,
  TlHeader,
} from '../../../components/scaffolding/table-list/tl-table/tl-table.component';
import { MatDialog } from '@angular/material/dialog';
import { VoteWithdrawal } from '../../../dialogs/vote-withdrawal/vote-withdrawal.dia';
import { UserService } from '../../../services/user.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Currencies } from 'src/shared/entities/currency/currency';
import { environment } from 'src/environments/environment';
import { TablePageBase } from '../../../bases/page-base';
import { LoginService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { WithdrawalCrud } from '../../../services/crud/withdrawals/withdrawals.crud';

@Component({
  selector: 'treasure_account',
  styleUrls: ['./treasure_account.css'],
  templateUrl: './treasure_account.html',
})
export class TreasureAccount extends TablePageBase implements AfterContentInit {
  public pageName = 'Withdrawals';
  public withdrawals: any[] = [];
  public treasureAmount = 100;
  public amount = 0;
  public concept = '';
  public error = '';
  public loading = false;
  public loadingList = false;
  public btnDisabled = false;
  public offset = 0;
  public limit = 10;
  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public withdrawalList = [];
  public sortedData = [];
  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
    },
    {
      sort: 'amount',
      title: 'Amount',
      type: 'code',
      accessor(el) {
        return el.amount / Math.pow(10, 8);
      },
    },
    {
      sort: 'description',
      title: 'Description',
    },
    {
      sort: 'status',
      statusClass: (el: any) => ({
        'col-error': el === 'rejected',
        'col-success': el === 'sent' || el === 'approved',
        'col-warning': el === 'pending',
      }),
      title: 'Status',
      type: 'status',
    },
    {
      sort: 'created',
      title: 'Created',
      type: 'date',
    },
  ];
  public needsToVote = false;
  public itemOptions: TlItemOption[] = [
    {
      callback: this.vote.bind(this),
      disabled: (el) => {
        return false;
      },
      text: (el) => {
        return 'Vote';
      },
    },
  ];
  public activeWithdrawal: any;
  public caBalance: any;
  public caName: any;

  constructor(
    public controles: ControlesService,
    public crud: WithdrawalCrud,
    public ws: WalletService,
    public us: UserService,
    public as: AdminService,
    public dialog: MatDialog,
    public alerts: AlertsService,
    public crudAccounts: AccountsCrud,
    public ls: LoginService,
    public router: Router,
    public titleService: Title
  ) {
    super(router);
  }

  public ngAfterContentInit() {
    this.reset();
    this.getCentralAccountData();
    this.needsToVote = this.as.checkIfUserNeedsToVote(
      this.us.userData,
    );
  }

  public getCentralAccountData() {
    this.crudAccounts
      .find(+environment.novactId)
      .subscribe(({ data }) => {
        this.caBalance = data.getBalance('REC');
        this.caName = data.name;
      });
  }

  public search() {
    this.loadingList = true;
    this.crud
      .search({
        order: this.sortDir,
        sort: this.sortID,
        offset: this.offset,
        limit: this.limit,
      })
      .subscribe(
        (resp) => {
          this.withdrawals = resp.data.elements.map((el) => {
            el.data = [];
            return el;
          });

          this.total = resp.data.total;
          this.sortedData = this.withdrawals.slice();
          this.loadingList = false;
        },
        (error) => {
          this.alerts.showSnackbar(error.message, 'ok');
          this.loadingList = false;
        },
      );
  }

  public sendRecs() {
    this.loading = true;

    const scaledAmount = WalletService.scaleNum(
      this.amount,
      Currencies.REC.scale,
    );

    this.as
      .createWithdrawal({
        amount: scaledAmount,
        description: this.concept,
      })
      .subscribe(
        (resp) => {
          this.alerts.showSnackbar('Created withdrawal correctly');
          this.reset();
          this.loading = false;
        },
        (err) => {
          this.alerts.showSnackbar(err.message);
          this.loading = false;
        },
      );
  }

  public reset() {
    this.treasureAmount = 100;
    this.amount = 0;
    this.error = '';
    this.loading = false;
    this.btnDisabled = false;
    this.check();
    this.search();
  }

  public checkAmount() {
    if (this.amount > 100000) {
      this.error = 'Max amount exceeded!';
      this.btnDisabled = true;
    } else if (this.amount > this.treasureAmount) {
      this.error = 'No funds available';
      this.btnDisabled = true;
    } else {
      this.error = '';
      this.btnDisabled = false;
    }
  }

  public checkConcept() {
    if (!this.concept) {
      this.error = 'Concept is required';
      this.btnDisabled = true;
    } else {
      this.error = '';
      this.btnDisabled = false;
    }
  }

  public check() {
    this.checkAmount();
    this.checkConcept();
  }

  public vote(withdrawal) {
    const validation = withdrawal.validations.filter(
      (el) => el.validator.id === this.us.userData.id,
    );
    return this.alerts
      .openModal(VoteWithdrawal, {
        withdrawal,
        validation,
      })
      .subscribe((result) => {
        return;
      });
  }
}
