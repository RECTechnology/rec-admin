import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../services/transactions/transactions.service';
import BaseDialog from '../../../bases/dialog-base';

@Component({
  selector: 'cash-out-tesoro',
  templateUrl: './cash-out-tesoro.html',
})

export class CashOutTesoroDia extends BaseDialog {
  public tx = {
    address: '',
    amount: 0,
    concept: '',
  };
  constructor(
    public dialogRef: MatDialogRef<CashOutTesoroDia>,
    public txService: TransactionService,
  ) { super(); }

  public makeTx() {
    return;
  }
}
