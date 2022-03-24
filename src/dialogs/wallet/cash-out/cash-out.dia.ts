import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../services/transactions/transactions.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Currencies } from 'src/shared/entities/currency/currency';
import { Account } from 'src/shared/entities/account.ent';
type CashOutTxData = {amount: number, concept: string, receiver: Account, sender: Account, sms_code:string};
@Component({
  selector: 'cash-out',
  templateUrl: './cash-out.html',
})

export class CashOutDia extends BaseDialog {
  public from_address: string = '';
  public tx: CashOutTxData = {
    amount: 0,
    concept: 'cash-out',
    receiver: null,
    sender: null,
    sms_code: '',
  };
  public available: number = 0;
  public loading = false;
  public accountFilters = {
    // active: 1,
    // type: 'COMPANY',
  };
  public validationErrors  = [];

  constructor(
    public dialogRef: MatDialogRef<CashOutDia>,
    public txService: TransactionService,
    public ws: WalletService,
    public alerts: AlertsService,
  ) {
    super();
  }

  

  public switchSides() {
    const temp = this.tx.sender;
    this.tx.sender = this.tx.receiver;
    this.tx.receiver = temp;
  }

  public makeTx() {
    if (this.loading) {
      return;
    }

    if (!this.tx.receiver) {
      return this.validationErrors.push({ property: 'Origin Account', message: 'Origin account is required' });
    } else if (!this.tx.sender) {
      return this.validationErrors.push({ property: 'Target Account', message: 'Target account is required' });
    }

    this.loading = true;
    this.txService.sendTx(
      this.tx.sender.id, this.tx.receiver.id,
      this.tx.concept, this.tx.sms_code,
      WalletService.scaleNum(this.tx.amount, Currencies.REC.scale),
    ).subscribe((resp) => {
      this.alerts.showSnackbar('SENT_CORRECTLY');
      this.close(true);
    }, (err) => {
      this.alerts.showSnackbar(err.message);
      this.loading = false;
    });
  }
}
