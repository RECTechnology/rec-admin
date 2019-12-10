import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';

@Component({
  selector: 'tx-details',
  templateUrl: './tx-details.html',
})
export class TxDetails extends BaseDialog implements OnInit {
  public transaction: any = {};
  public showRefund = false;

  constructor(
    public dialogRef: MatDialogRef<TxDetails>,
    public us: UserService,
    public ws: WalletService,
  ) {
    super();
  }

  public action = (a, b) => { return; };

  public ngOnInit() {
    this.showRefund = this.transaction.actions && this.transaction.actions.enabled.includes('refund');
  }

  public doRefund() {
    this.action('refund', this.transaction);
  }

  public scaleNum(number, scale) {
    return (number / Math.pow(10, scale)).toFixed(scale);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
