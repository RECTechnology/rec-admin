import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { TransactionService } from '../../../../services/transactions/transactions.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';

@Component({
  selector: 'add_comment',
  templateUrl: './add_comment.html',
})

export class AddCommentDia extends BaseDialog {
  public transaction: any = {};
  public comment = '';

  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<AddCommentDia>,
    public txService: TransactionService,
    private snackBar: MySnackBarSevice,
  ) { super(); }

  public addComment() {
    this.loading = true;
    this.txService.addCommentToTransaction(this.comment, this.transaction.id)
      .subscribe(
        (resp) => {
          const message = `Added comment correctly!`;
          this.snackBar.open(message, 'ok', { duration: 3500 });
          this.loading = false;
          this.close();
        },
        (error) => {
          this.error = error._body.message;
          setTimeout((x) => { this.error = ''; }, 3500);
          this.loading = false;
        });
  }
}
