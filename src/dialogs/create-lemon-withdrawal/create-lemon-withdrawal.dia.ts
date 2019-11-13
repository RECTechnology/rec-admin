import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../services/user.service';
import BaseDialog from '../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'projects/ngx-rec-api/src/lib/entities/account.ent';

@Component({
  selector: 'create-lemon-withdrawal',
  templateUrl: './create-lemon-withdrawal.html',
})

export class CreateLemonWithdrawalDia extends BaseDialog {
  public id: any;
  public account: Account;
  public currentAmount: number;
  public concept: string;
  public amount: number;

  constructor(
    public dialogRef: MatDialogRef<CreateLemonWithdrawalDia>,
    private us: UserService,
    public alerts: AlertsService,
    public accountCrud: AccountsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.accountCrud.find(this.id).subscribe((resp) => {
      this.account = resp.data;
      this.currentAmount = this.account.getBalance('REC');
    });
  }
}