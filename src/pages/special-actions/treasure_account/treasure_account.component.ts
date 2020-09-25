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

@Component({
  selector: 'treasure_account',
  styleUrls: ['./treasure_account.css'],
  templateUrl: './treasure_account.html',
})
export class TreasureAccount implements AfterContentInit {
  public treasureAmount = 100;
  public amount = 0;
  public concept = '';
  public error = '';
  public loading = false;
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
  public novactBalance: any;

  constructor(
    public controles: ControlesService,
    public ws: WalletService,
    public us: UserService,
    public as: AdminService,
    public dialog: MatDialog,
    public alerts: AlertsService,
    public crudAccounts: AccountsCrud,
  ) {}

  public ngAfterContentInit() {
    this.reset();
    this.getNovactBalance();
    this.needsToVote = this.as.checkIfUserNeedsToVote(
      this.us.userData,
    );
  }

  public getNovactBalance() {
    this.crudAccounts
      .find(+environment.novactId)
      .subscribe(({ data }) => {
        console.log(data);
        this.novactBalance = data.getBalance('REC');
      });
  }

  public getList() {
    this.as.getWithdrawals().subscribe(
      (resp) => {
        this.withdrawalList = resp.data.elements;
        this.sortedData = this.withdrawalList.slice();
        this.activeWithdrawal = this.sortedData[0];
      },
      (err) => {
        return;
      },
    );
  }

  public sendRecs() {
    this.loading = true;

    this.as
      .createWithdrawal({
        amount: this.amount,
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
    this.getList();
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

  public changedPage($evt) {
    return;
  }
  public sortData($evt?) {
    return;
  }
}
