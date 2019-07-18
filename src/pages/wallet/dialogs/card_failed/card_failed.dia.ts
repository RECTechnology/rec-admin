import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { TransactionService } from '../../../../services/transactions/transactions.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';
import { PrepaidCardMulti } from '../../../../shared/entities/prepaid_card/prepaid_card';

@Component({
  selector: 'card_failed',
  templateUrl: './card_failed.html',
})
export class CardFailedDia extends BaseDialog {
  public card: PrepaidCardMulti;
  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<CardFailedDia>,
    public txService: TransactionService,
    private snackBar: MySnackBarSevice,
  ) { super(); }
}
