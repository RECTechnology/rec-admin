import { Component, AfterContentInit } from '@angular/core';
import { WalletService } from '../../services/wallet/wallet.service';
import { ControlesService } from '../../services/controles/controles.service';
import { AdminService } from '../../services/admin/admin.service';
import { TlItemOption, TlHeader } from '../../components/table-list/tl-table/tl-table.component';
import { MatDialog } from '@angular/material';
import { VoteWithdrawal } from '../../dialogs/vote-withdrawal/vote-withdrawal.dia';
import { UserService } from '../../services/user.service';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'treasure_account',
  styleUrls: ['./treasure_account.css'],
  templateUrl: './treasure_account.html',
})
export class TreasureAccount implements AfterContentInit {
  public novactAmount = 1000;
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
  public sortedData = [
    {
      amount: 123,
      approved: false,
      created: '2019-07-02T16:27:20+00:00',
      description: 'ads',
      expires_at: '2019-07-02T16:27:20+00:00',
      id: 1,
      sent: false,
      status: 'rejected',
      updated: '2019-07-01T16:27:20+00:00',
    },
  ];
  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
    }, {
      sort: 'amount',
      title: 'Amount',
      type: 'code',
    }, {
      sort: 'description',
      title: 'Description',
    }, {
      sort: 'status',
      statusClass: (el: any) => ({
        'col-error': el === 'sent' || el === 'rejected',
        'col-success': el === 'approved',
      }),
      title: 'Status',
      type: 'status',
    }, {
      sort: 'approved',
      title: 'Approved',
      type: 'checkbox',
    }, {
      sort: 'sent',
      title: 'Sent',
      type: 'checkbox',
    },
  ];
  public needsToVote = false;
  public itemOptions: TlItemOption[] = [{
    callback: this.vote.bind(this),
    disabled: (el) => {
      return false;
    },
    text: (el) => {
      return 'Vote';
    },
  }];
  public activeWithdrawal: any;

  constructor(
    public controles: ControlesService,
    public ws: WalletService,
    public us: UserService,
    public as: AdminService,
    public dialog: MatDialog,
    public alerts: AlertsService,
  ) { }

  public ngAfterContentInit() {
    this.reset();
    this.needsToVote = this.as.checkIfUserNeedsToVote(this.us.userData);
  }

  public getList() {
    this.as.getWithdrawals()
      .subscribe(
        (resp) => {
          this.withdrawalList = resp.data.elements;
          this.sortedData = this.withdrawalList.slice();
          this.activeWithdrawal = this.sortedData[0];
        },
        (err) => { return; },
      );
  }

  public sendRecs() {
    this.loading = true;

    this.as.createWithdrawal({
      amount: this.amount,
      description: this.concept,
    }).subscribe(
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
    this.novactAmount = 1000;
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
    const validation = withdrawal.validations.filter((el) => el.validator.id === this.us.userData.id);
    return this.alerts.openModal(VoteWithdrawal, {
      withdrawal,
      validation,
    }).subscribe((result) => { return; });
  }

  public changedPage($evt) {
    return;
  }
  public sortData($evt?) {
    return;
  }
}
