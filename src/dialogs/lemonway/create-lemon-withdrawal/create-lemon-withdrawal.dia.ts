import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';

@Component({
  selector: 'create-lemon-withdrawal',
  templateUrl: './create-lemon-withdrawal.html',
})

export class CreateLemonWithdrawalDia extends BaseDialog {
  public id: any;
  public account: Account;
  public currentAmountREC: number = 0;
  public currentAmountEUR: number = 0;
  public concept: string = 'Money-out NOVACT rec moneda ciutadana';
  public amount: number;
  public otp: string;
  public lwInfo: any;

  public ibans: any[] = [];
  public validationErrors: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateLemonWithdrawalDia>,
    private us: UserService,
    public alerts: AlertsService,
    public accountCrud: AccountsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.accountCrud.lwGetWallet(this.id)
      .subscribe((resp) => {
        this.lwInfo = resp.data;
        this.ibans = this.lwInfo.IBANS;
      });
    this.accountCrud.find(this.id).subscribe((resp) => {
      this.account = resp.data;
      this.currentAmountREC = this.account.getBalance('REC');
      this.currentAmountEUR = this.account.lw_balance || 0;
    });
  }

  public proceed() {
    this.loading = true;
    this.accountCrud.lwMoneyOut(this.lwInfo.ID, this.amount.toFixed(2), this.concept, this.otp)
      .subscribe((resp) => {
        this.loading = false;
        this.alerts.showSnackbar('Success');
        this.close();
      }, (err) => {
        if (err.errors) {
          this.validationErrors = UtilsService.normalizeLwError(err.errors);
          console.log(this.validationErrors);
        } else {
          this.alerts.showSnackbar(err.message);
        }
        this.loading = false;
      });
  }
}
