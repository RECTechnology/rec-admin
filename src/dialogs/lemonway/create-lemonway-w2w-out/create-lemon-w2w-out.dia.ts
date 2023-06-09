import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  public originAccountId: any;
  public targetAccountId: any;

  public originAccount: Account;
  public targetAccount: Account;

  public concept: string = 'Traspaso';
  public amount: number;
  public iban: string;

  public validationErrors: any[] = [];

  public accountFilters = {
    active: 1,
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
    const tempId = this.originAccountId;
    const temp = this.originAccount;
    this.originAccountId = this.targetAccountId;
    this.originAccount = this.targetAccount;
    this.targetAccountId = tempId;
    this.targetAccount = temp;

    this.ngOnInit();
  }

  public ngOnInit() {
    if (this.originAccountId) {
      this.accountCrud.find(this.originAccountId)
        .subscribe((resp) => {
          this.originAccount = resp.data;
        });
    } else if (this.targetAccountId) {
      this.accountCrud.find(this.targetAccountId)
        .subscribe((resp) => {
          this.targetAccount = resp.data;
        });
    }
  }

  public proceed() {
    if (this.loading) {
      return;
    }

    if (!this.originAccount) {
      return this.validationErrors.push({ property: 'Origin Account', message: 'Origin account is required' });
    } else if (!this.targetAccount) {
      return this.validationErrors.push({ property: 'Target Account', message: 'Target account is required' });
    }

    this.loading = true;
    this.accountCrud.lwSendPayment(this.originAccount.cif, this.targetAccount.cif, this.amount, this.concept)
      .subscribe((resp) => {
        this.loading = false;
        this.alerts.showSnackbar('Success');
        this.close();
      }, (err) => {
        if (err.errors) {
          this.validationErrors = UtilsService.normalizeLwError(err.errors);
        } else {
          this.alerts.showSnackbar(err.message);
        }
        this.loading = false;
      });
  }
}
