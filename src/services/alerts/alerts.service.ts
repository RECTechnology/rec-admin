import { Injectable } from '@angular/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MatDialog } from '@angular/material';
import { ConfirmationMessage } from 'src/components/dialogs/confirmation-message/confirmation.dia';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(
    public snackbar: MySnackBarSevice,
    public dialog: MatDialog,
  ) { }

  public showSnackbar(message, buttonText = 'ok') {
    return this.snackbar.open(message, buttonText);
  }

  public showConfirmation(message, title, btnConfirmText, status = 'error', headerIcon = 'warning') {
    return this.openModal(ConfirmationMessage, {
      btnConfirmText, message, status, title, headerIcon
    });
  }

  public openModal(C, props = {}) {
    const dialogRef = this.dialog.open(C);
    for (const key in props) {
      if (key) {
        dialogRef.componentInstance[key] = props[key];
      }
    }
    return dialogRef.afterClosed();
  }
}
