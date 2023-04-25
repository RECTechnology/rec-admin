import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';
import { WalletService } from 'src/services/wallet/wallet.service';
import { Currencies } from 'src/shared/entities/currency/currency';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'create-lemon-withdrawal',
  templateUrl: './create-lemon-withdrawal.html',
})
export class CreateLemonWithdrawalDia extends BaseDialog {
  public id: any;
  public account: Account;
  public currentAmountREC: number = 0;
  public currentAmountEUR: number = 0;
  public concept: string = `Money-out NOVACT ${environment.crypto_currency} moneda ciutadana`;
  public amount: number;
  public otp: string;
  public lwInfo: any;

  public ibans: any[] = [];
  public validationErrors: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateLemonWithdrawalDia>,
    private us: UserService,
    public alerts: AlertsService,
    public accountCrud: AccountsCrud
  ) {
    super();
  }

  public ngOnInit() {
    this.accountCrud.lwGetWallet(this.id).subscribe((resp) => {
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
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.accountCrud
      .createWithdrawal(
        this.account.id,
        WalletService.scaleNum(this.amount, Currencies.EUR.scale),
        this.concept,
        this.otp,
        Currencies.EUR.name
      )
      .subscribe(
        (resp) => {
          this.loading = false;
          this.alerts.showSnackbar('Success');
          this.close();
        },
        (err) => {
          if (err.errors) {
            this.validationErrors = UtilsService.normalizeLwError(
              err.errors
            );
          } else {
            this.alerts.showSnackbar(err.message);
          }
          this.loading = false;
        }
      );
  }
}
