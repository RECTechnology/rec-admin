import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';

@Component({
  selector: 'create-lemon-w2w-in',
  templateUrl: './create-lemon-w2w-in.html',
})
export class CreateLemonWallet2WalletInDia extends BaseDialog {
  public id: any;
  public account: Account;
  public currentAmountREC: number;
  public currentAmountEUR: number;

  public originAccountId = null;
  public targetAccountId = null;

  public concept: string;
  public amount: number;

  constructor(
    public dialogRef: MatDialogRef<CreateLemonWallet2WalletInDia>,
    private us: UserService,
    public alerts: AlertsService,
    public accountCrud: AccountsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.accountCrud.find(this.id).subscribe((resp) => {
      this.account = resp.data;
      this.currentAmountREC = this.account.getBalance('REC');
      this.currentAmountEUR = this.account.getBalance('EUR');
    });
  }

  public proceed() {
    this.loading = true;
    this.accountCrud.lwSendFrom(this.amount, this.originAccountId, this.targetAccountId)
      .subscribe((resp) => {
        this.loading = true;
        this.alerts.showSnackbar('Success');
        this.close();
      }, (err) => {
        this.alerts.showSnackbar(err.message);
        this.loading = false;
      });
  }
}
