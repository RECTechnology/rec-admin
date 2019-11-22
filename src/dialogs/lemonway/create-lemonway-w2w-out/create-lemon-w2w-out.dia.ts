import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';

@Component({
  selector: 'create-lemon-w2w-out',
  templateUrl: './create-lemon-w2w-out.html',
})

export class CreateLemonWallet2WalletOutDia extends BaseDialog {
  public id: any;
  public account: Account;
  public currentAmountREC: number;
  public currentAmountEUR: number;

  public originAccount;
  public targetAccount;
  public concept: string = 'Traspaso';
  public amount: number;
  public iban: string;

  public validationErrors: any[] = [];

  public accountFilters = {
    active: 1,
    tier: 2,
    type: 'COMPANY',
  };

  constructor(
    public dialogRef: MatDialogRef<CreateLemonWallet2WalletOutDia>,
    private us: UserService,
    public alerts: AlertsService,
    public accountCrud: AccountsCrud,
  ) {
    super();
  }

  public switchSides() {
    const temp = this.originAccount;
    this.originAccount = this.targetAccount;
    this.targetAccount = temp;

    this.ngOnInit();
  }

  public ngOnInit() {
    this.accountCrud.find(this.originAccount.id).subscribe((resp) => {
      this.account = resp.data;
      this.currentAmountREC = this.account.getBalance('REC');
      this.currentAmountEUR = this.account.lw_balance;
    });
  }

  public proceed() {
    this.loading = true;
    this.accountCrud.lwSendPayment(this.account.cif, this.targetAccount.cif, this.amount, this.concept)
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
