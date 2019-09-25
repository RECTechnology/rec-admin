import { Injectable } from '@angular/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MatDialog, MatSnackBarConfig } from '@angular/material';
import { ConfirmationMessage } from 'src/components/dialogs/confirmation-message/confirmation.dia';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(
    public snackbar: MySnackBarSevice,
    public dialog: MatDialog,
  ) { }

  public showSnackbar(message, buttonText = 'ok', opts: MatSnackBarConfig) {
    return this.snackbar.open(message, buttonText, opts);
  }

  public showConfirmation(message, title, btnConfirmText, status = 'error', headerIcon = 'warning') {
    return this.openModal(ConfirmationMessage, {
      btnConfirmText, headerIcon, message, status, title,
    });
  }

  public openModal(C, props = {}, modalOptions = {}) {
    const dialogRef = this.dialog.open(C, modalOptions);
    for (const key in props) {
      if (key) {
        dialogRef.componentInstance[key] = props[key];
      }
    }
    return dialogRef.afterClosed();
  }
}
