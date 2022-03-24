import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../services/transactions/transactions.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'add_comment',
  templateUrl: './add_comment.html',
})

export class AddCommentDia extends BaseDialog {
  public transaction: any = {};
  public comment = '';

  constructor(
    public dialogRef: MatDialogRef<AddCommentDia>,
    public txService: TransactionService,
    private alerts: AlertsService,
  ) { super(); }

  public addComment() {
    this.loading = true;
    this.txService.addCommentToTransaction(this.comment, this.transaction.id)
      .subscribe(
        (resp) => {
          this.alerts.showSnackbar('ADDED_COMMENT', 'ok', { duration: 3500 });
          this.loading = false;
          this.close();
        },
        (error) => {
          this.error = error.message;
          setTimeout((x) => { this.error = ''; }, 3500);
          this.loading = false;
        });
  }
}
