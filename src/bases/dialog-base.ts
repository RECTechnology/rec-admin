import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ConfirmationMessage } from '../components/dialogs/confirmation-message/confirmation.dia';
import { environment } from '../environment/environment';
import { Brand } from '../environment/brand-wl';

export default abstract class BaseDialog {
  public abstract dialogRef: MatDialogRef<any>;
  public dialog: MatDialog;
  public error: string = '';
  public loading: boolean = false;
  public mainAction = Function;
  public disabled: boolean = false;
  public environment = environment;
  public brand = Brand;

  constructor(dialog?: MatDialog) {
    this.dialog = dialog;
  }

  public setReference(ref: MatDialogRef<any>) {
    this.dialogRef = ref;
  }

  public showConfirmation(data, action) {
    if (!this.dialog.open) {
      console.warn('Please pass "MatDialog" into "BaseDialog" contructor/super');
      if (typeof action === 'function') { action(data); }
    }

    const dialogRef = this.dialog.open(ConfirmationMessage);
    dialogRef.componentInstance.status = 'error';
    dialogRef.componentInstance.title = 'Confirm Action';
    dialogRef.componentInstance.message = 'Are you sure you want to proceed?';
    dialogRef.componentInstance.btnConfirmText = 'CONTINUE';

    // tslint:disable-next-line: forin
    for (const key in data) {
      dialogRef.componentInstance[key] = data[key];
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (typeof action === 'function') { action(data); }
      }
    });
  }

  public close(confirm?: any): void {
    this.dialogRef.close();
  }
}
