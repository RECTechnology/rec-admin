import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.html',
})

export class ConfirmationMessage {
  public message: string = 'Are you sure you want to do that?';
  public trailing: string;
  public status: string = 'blue';
  public title: string = 'blue';
  public btnConfirmText: string = 'ok';
  public btnCancelText: string = 'Cancel';
  public headerIcon: string = null;
  public data: any = {};
  public opts: any = {};

  constructor(
    public dialogRef: MatDialogRef<ConfirmationMessage>,
  ) { }

  public close(confirmed = false): void {
    this.dialogRef.close(confirmed);
  }
}
