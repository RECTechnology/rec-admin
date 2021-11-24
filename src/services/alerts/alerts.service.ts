import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmationMessage } from 'src/dialogs/other/confirmation-message/confirmation.dia';

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
  //title, message, data: any, customBtnText = null, customBtn = true
  public showConfirmation(
    message,
    data: any,
    
    title,
    opts: any = {},
  ) {
    return this.openModal(ConfirmationMessage, {
      ...{
        btnConfirmText: 'OK',
        headerIcon: false,
        status: 'error',
        opts: {},
        trailing: null,
      },
      message,
      data:data,
      title,
      ...opts,
    });
  }

  public confirmDeletion(itemName = 'Item', trailing?: string, showConfirm = true) {
    return showConfirm ? this.showConfirmation(
      'DELETE_CONFIRM',
      {},
      'Delete ' + itemName + '?',
      
      {
        btnConfirmText: 'Delete',
        trailing,
      },
    ) : of(true);
  }

  public observableErrorSnackbar(error) {
    this.showSnackbar(error.message);
  }

  public openModal(C, props = {}, modalOptions = {}) {
    return this.createModal(C, props, modalOptions).afterClosed();
  }

  public createModal(C, props = {}, modalOptions = {}) {
    const dialogRef = this.dialog.open(C, modalOptions);

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
