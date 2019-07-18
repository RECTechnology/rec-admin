import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { UserService } from '../../../../services/user.service';
import BaseDialog from '../../../../bases/dialog-base';
import { WalletService } from '../../../../services/wallet/wallet.service';

@Component({
  selector: 'tx-details',
  templateUrl: '../../../../pages/wallet/dialogs/tx_details/tx-details.html',
})
export class TxDetails extends BaseDialog implements OnInit {
  public transaction: any = {};
  private showRefund = false;

  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<TxDetails>,
    private us: UserService,
    private ws: WalletService,
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
