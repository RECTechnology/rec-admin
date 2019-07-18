import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { TransactionService } from '../../../../services/transactions/transactions.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';

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
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<CashOutTesoroDia>,
    public txService: TransactionService,
    private snackBar: MySnackBarSevice,
  ) { super(); }
}
