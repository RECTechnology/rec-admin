import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TransactionService } from '../../../services/transactions/transactions.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Currencies } from 'src/shared/entities/currency/currency';
import { AccountPickerComponent } from 'src/components/selectors/account-picker/account-picker.component';

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
  public accountFilters = {
    active: 1,
    type: 'COMPANY',
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
      this.tx.sender, this.tx.receiver,
      this.tx.concept, this.tx.sms_code,
      WalletService.scaleNum(this.tx.amount, Currencies.REC.scale),
    ).subscribe((resp) => {
      this.alerts.showSnackbar('Sent correclty');
      this.close(true);
    }, (err) => {
      this.alerts.showSnackbar(err.message);
      this.loading = false;
    });
  }
}
