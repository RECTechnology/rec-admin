import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
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
    public dialogRef: MatDialogRef<ChangePhone>,
    public us: UserService,
    public ws: WalletService,
  ) {
    super();
  }

  public ngOnInit() {
    return;
  }
  public changePhone() {
    return;
  }
}
