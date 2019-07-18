import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { TransactionService } from '../../../../services/transactions/transactions.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';
import { WalletService } from '../../../../services/wallet/wallet.service';

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

  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<CashOutDia>,
    public txService: TransactionService,
    public ws: WalletService,
    private snackBar: MySnackBarSevice,
  ) {
    super();
    this.available = this.ws.getAvailable('REC', true);
  }

  public makeTx() {
    this.txService.sendTx(this.tx.sender, this.tx.receiver, this.tx.concept, this.tx.sms_code, this.tx.amount)
      .subscribe((resp) => {
        this.snackBar.open('Sent correclty');
        this.close(true);
      }, (err) => {
        this.snackBar.open(err._body.message);
        this.close(false);
      });
  }
}
