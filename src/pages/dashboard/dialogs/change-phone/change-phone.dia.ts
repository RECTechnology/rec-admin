import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { UserService } from '../../../../services/user.service';
import BaseDialog from '../../../../bases/dialog-base';
import { WalletService } from '../../../../services/wallet/wallet.service';

@Component({
  selector: 'change-phone',
  templateUrl: './change-phone.html',
})
export class ChangePhone extends BaseDialog implements OnInit {
  public user: any = {};
  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<ChangePhone>,
    private us: UserService,
    private ws: WalletService,
  ) {
    super();
  }

  public ngOnInit() {
    return;
  }
}
