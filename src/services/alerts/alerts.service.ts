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

  public showSnackbar(message, buttonText = 'ok', opts: MatSnackBarConfig = {}) {
    return this.snackbar.open(message, buttonText, opts);
  }

  public showConfirmation(message, title, btnConfirmText, status = 'error', headerIcon = 'warning', opts = {}) {
    return this.openModal(ConfirmationMessage, {
      btnConfirmText, headerIcon, message, status, title, opts,
    });
  }

  public openModal(C, props = {}, modalOptions = {}) {
    return this.createModal(C, props, modalOptions).afterClosed();
  }

  public createModal(C, props = {}, modalOptions = {}) {
    const dialogRef: any = this.dialog.open(C, modalOptions);

    /**
     * This (passing parameters to the modal)
     * can now be done by passing params into dialog.open(C, { params: {} })
     *
     * But most of the modals don't use it, and asume the params will be injected on creation
     */
    // TODO: Need to change modals to accept new way of passing parameters
    for (const key in props) {
      if (key) {
        dialogRef.componentInstance[key] = props[key];
      }
    }

    return dialogRef;
  }
}
