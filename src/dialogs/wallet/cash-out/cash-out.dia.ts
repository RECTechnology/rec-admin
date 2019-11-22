import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TransactionService } from '../../../services/transactions/transactions.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'cash-out',
  templateUrl: './cash-out.html',
})

export class CashOutDia extends BaseDialog {
  public from_address: string = '';
  public tx = {
    amount: 0,
    concept: 'cash-out',
    receiver: '',
    sender: '',
    sms_code: '',
  };
  public available: number = 0;
  public loading = false;

  constructor(
    public dialogRef: MatDialogRef<CashOutDia>,
    public txService: TransactionService,
    public ws: WalletService,
    public alerts: AlertsService,
  ) {
    super();
  }

  public makeTx() {
    // if (this.loading) {
    //   return;
    // }

    // this.loading = true;
    this.txService.sendTx(this.tx.sender, this.tx.receiver, this.tx.concept, this.tx.sms_code, this.tx.amount)
      .subscribe((resp) => {
        this.alerts.showSnackbar('Sent correclty');
        this.close(true);
      }, (err) => {
        this.alerts.showSnackbar(err.message);
        // this.loading = false;
      });
  }
}
